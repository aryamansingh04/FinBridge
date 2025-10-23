import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { useNotificationHelpers } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Car, 
  GraduationCap, 
  CreditCard, 
  Calculator,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  DollarSign,
  Calendar,
  PieChart,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
  isSignedIn: boolean;
  signInMethod: string;
}

interface LoanType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenureMonths: number[];
  eligibilityScore: number;
  isEligible: boolean;
  maxEligibleAmount: number;
  monthlyEMI: number;
  totalRepayment: number;
  processingFee: number;
  requiredDocuments: string[];
}

export const Loan = () => {
  const { t } = useTranslation();
  const { walletData, addPendingTransaction, approveLoan } = useWallet();
  const { notifyLoan } = useNotificationHelpers();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [emiAmount, setEmiAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [isApplicationSuccess, setIsApplicationSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [loanTransactionId, setLoanTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  }, []);

  // Calculate eligibility based on financial data
  const calculateEligibility = (loanType: string) => {
    const currentBalance = walletData.currentBalance;
    const monthlySalary = userProfile ? parseInt(userProfile.monthlySalary.replace(/[^\d]/g, '')) : 0;
    const transactions = walletData.transactions;
    
    // Calculate average monthly income from transactions
    const incomeTransactions = transactions.filter(t => t.type === 'income' || t.type === 'deposit');
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgMonthlyIncome = totalIncome > 0 ? totalIncome / Math.max(1, transactions.length / 30) : monthlySalary;
    
    // Calculate credit score based on transaction history
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(t => t.status === 'completed').length;
    const creditScore = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 50;
    
    // Calculate debt-to-income ratio
    const expenseTransactions = transactions.filter(t => t.type === 'expense' || t.type === 'withdraw');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgMonthlyExpenses = totalExpenses > 0 ? totalExpenses / Math.max(1, transactions.length / 30) : avgMonthlyIncome * 0.3;
    const debtToIncomeRatio = avgMonthlyExpenses / avgMonthlyIncome;
    
    // Eligibility calculation
    let eligibilityScore = 0;
    
    // Income factor (40% weight)
    if (avgMonthlyIncome >= 50000) eligibilityScore += 40;
    else if (avgMonthlyIncome >= 30000) eligibilityScore += 30;
    else if (avgMonthlyIncome >= 20000) eligibilityScore += 20;
    else if (avgMonthlyIncome >= 10000) eligibilityScore += 10;
    
    // Credit score factor (30% weight)
    eligibilityScore += (creditScore / 100) * 30;
    
    // Balance factor (20% weight)
    if (currentBalance >= 100000) eligibilityScore += 20;
    else if (currentBalance >= 50000) eligibilityScore += 15;
    else if (currentBalance >= 25000) eligibilityScore += 10;
    else if (currentBalance >= 10000) eligibilityScore += 5;
    
    // Debt-to-income ratio factor (10% weight)
    if (debtToIncomeRatio <= 0.3) eligibilityScore += 10;
    else if (debtToIncomeRatio <= 0.5) eligibilityScore += 5;
    
    return Math.min(100, Math.max(0, eligibilityScore));
  };

  // Calculate maximum eligible amount
  const calculateMaxEligibleAmount = (loanType: string, eligibilityScore: number) => {
    const monthlySalary = userProfile ? parseInt(userProfile.monthlySalary.replace(/[^\d]/g, '')) : 0;
    const currentBalance = walletData.currentBalance;
    
    let baseAmount = 0;
    switch (loanType) {
      case 'home':
        baseAmount = monthlySalary * 60; // 5 years salary
        break;
      case 'car':
        baseAmount = monthlySalary * 24; // 2 years salary
        break;
      case 'education':
        baseAmount = monthlySalary * 36; // 3 years salary
        break;
      case 'personal':
        baseAmount = monthlySalary * 12; // 1 year salary
        break;
      default:
        baseAmount = monthlySalary * 12;
    }
    
    // Adjust based on eligibility score
    const adjustedAmount = baseAmount * (eligibilityScore / 100);
    
    // Ensure minimum balance requirement
    const minBalanceRequired = adjustedAmount * 0.1; // 10% of loan amount
    if (currentBalance < minBalanceRequired) {
      return Math.min(adjustedAmount, currentBalance * 10);
    }
    
    return Math.round(adjustedAmount);
  };

  // Calculate EMI
  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const loanTypes: LoanType[] = [
    {
      id: 'home',
      name: t('loan.homeLoan'),
      icon: <Home className="w-6 h-6" />,
      description: t('loan.homeLoanDescription'),
      minAmount: 500000,
      maxAmount: 10000000,
      interestRate: 8.5,
      tenureMonths: [180, 240, 300, 360],
      eligibilityScore: calculateEligibility('home'),
      isEligible: calculateEligibility('home') >= 60,
      maxEligibleAmount: calculateMaxEligibleAmount('home', calculateEligibility('home')),
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 0.5,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Slips', 'Bank Statements', 'Property Documents']
    },
    {
      id: 'car',
      name: t('loan.carLoan'),
      icon: <Car className="w-6 h-6" />,
      description: t('loan.carLoanDescription'),
      minAmount: 100000,
      maxAmount: 2000000,
      interestRate: 9.5,
      tenureMonths: [36, 48, 60, 72],
      eligibilityScore: calculateEligibility('car'),
      isEligible: calculateEligibility('car') >= 50,
      maxEligibleAmount: calculateMaxEligibleAmount('car', calculateEligibility('car')),
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 1.0,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Slips', 'Bank Statements', 'Driving License']
    },
    {
      id: 'education',
      name: t('loan.educationLoan'),
      icon: <GraduationCap className="w-6 h-6" />,
      description: t('loan.educationLoanDescription'),
      minAmount: 50000,
      maxAmount: 5000000,
      interestRate: 7.5,
      tenureMonths: [60, 84, 120, 180],
      eligibilityScore: calculateEligibility('education'),
      isEligible: calculateEligibility('education') >= 40,
      maxEligibleAmount: calculateMaxEligibleAmount('education', calculateEligibility('education')),
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 0.5,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Admission Letter', 'Fee Structure', 'Academic Records']
    },
    {
      id: 'personal',
      name: t('loan.personalLoan'),
      icon: <CreditCard className="w-6 h-6" />,
      description: t('loan.personalLoanDescription'),
      minAmount: 25000,
      maxAmount: 1000000,
      interestRate: 12.0,
      tenureMonths: [12, 24, 36, 48],
      eligibilityScore: calculateEligibility('personal'),
      isEligible: calculateEligibility('personal') >= 45,
      maxEligibleAmount: calculateMaxEligibleAmount('personal', calculateEligibility('personal')),
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 2.0,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Slips', 'Bank Statements']
    }
  ];

  const handleLoanSelect = (loan: LoanType) => {
    setSelectedLoan(loan);
    setLoanAmount(loan.maxEligibleAmount.toString());
    setTenure(loan.tenureMonths[1].toString()); // Default to second option
  };

  const handleCalculateEMI = () => {
    if (selectedLoan && loanAmount && tenure) {
      const principal = parseFloat(loanAmount);
      const rate = selectedLoan.interestRate;
      const tenureMonths = parseInt(tenure);
      
      const emi = calculateEMI(principal, rate, tenureMonths);
      const total = emi * tenureMonths;
      const interest = total - principal;
      
      setEmiAmount(emi);
      setTotalInterest(interest);
      setTotalRepayment(total);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleApplyForLoan = async () => {
    if (!selectedLoan || !loanAmount || !tenure) {
      toast({
        title: "Missing Information",
        description: "Please fill in all loan details before applying.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);

    // Create loan application transaction with pending status
    const transactionId = Date.now().toString();
    setLoanTransactionId(transactionId);

    // Add loan application transaction to wallet (with pending status)
    const newTransaction = {
      id: transactionId,
      type: "loan_application" as const,
      amount: parseFloat(loanAmount),
      description: `${selectedLoan.name} Application - ${formatCurrency(parseFloat(loanAmount))}`,
      category: "loan",
      date: new Date().toISOString().split('T')[0],
      status: "pending" as const,
      emi: emiAmount,
      tenure: parseInt(tenure),
      interestRate: selectedLoan.interestRate,
    };

    // Add pending transaction to wallet
    addPendingTransaction(newTransaction);
    
    // Add notification for loan application
    notifyLoan('applied', parseFloat(loanAmount), selectedLoan.name);

    // Simulate loan application and approval process
    setTimeout(() => {
      // Approve the loan (this will add amount to balance and update status)
      approveLoan(transactionId);
      
      // Add notification for loan approval
      notifyLoan('approved', parseFloat(loanAmount), selectedLoan.name);

      setIsApplying(false);
      setIsApplicationSuccess(true);
      
      toast({
        title: "Loan Approved!",
        description: `Your ${selectedLoan.name} for ${formatCurrency(parseFloat(loanAmount))} has been approved and credited to your account.`,
      });

      // Close the EMI calculator modal
      setSelectedLoan(null);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setIsApplicationSuccess(false);
    setLoanAmount("");
    setTenure("");
    setEmiAmount(0);
    setTotalInterest(0);
    setTotalRepayment(0);
  };

  const getEligibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEligibilityText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Please complete your profile to access loan services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('loan.title')}</h1>
          <p className="text-muted-foreground">{t('loan.subtitle')}</p>
        </div>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('loan.financialProfile')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{t('loan.currentBalance')}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(walletData.currentBalance)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{t('loan.monthlyIncome')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(userProfile ? parseInt(userProfile.monthlySalary.replace(/[^\d]/g, '')) : 0)}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{t('loan.creditScore')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(calculateEligibility('personal'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanTypes.map((loan) => (
            <Card key={loan.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {loan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{loan.name}</CardTitle>
                      <CardDescription>{loan.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getEligibilityColor(loan.eligibilityScore)}>
                    {getEligibilityText(loan.eligibilityScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Eligibility Score */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Eligibility Score</span>
                    <span>{Math.round(loan.eligibilityScore)}%</span>
                  </div>
                  <Progress value={loan.eligibilityScore} className="h-2" />
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Interest Rate</p>
                    <p className="font-semibold">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Amount</p>
                    <p className="font-semibold">{formatCurrency(loan.maxEligibleAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Fee</p>
                    <p className="font-semibold">{loan.processingFee}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tenure</p>
                    <p className="font-semibold">Up to {Math.max(...loan.tenureMonths) / 12} years</p>
                  </div>
                </div>

                {/* Eligibility Status */}
                <div className="flex items-center gap-2">
                  {loan.isEligible ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm ${loan.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                    {loan.isEligible ? 'Eligible for this loan' : 'Not eligible for this loan'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    disabled={!loan.isEligible}
                    onClick={() => handleLoanSelect(loan)}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate EMI
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{loan.name} Details</DialogTitle>
                        <DialogDescription>
                          Complete information about {loan.name.toLowerCase()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Required Documents:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {loan.requiredDocuments.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Loan Terms:</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Minimum Amount</p>
                              <p className="font-semibold">{formatCurrency(loan.minAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Maximum Amount</p>
                              <p className="font-semibold">{formatCurrency(loan.maxAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Interest Rate</p>
                              <p className="font-semibold">{loan.interestRate}% p.a.</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Processing Fee</p>
                              <p className="font-semibold">{loan.processingFee}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EMI Calculator Modal */}
        <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {selectedLoan?.name} EMI Calculator
              </DialogTitle>
              <DialogDescription>
                Calculate your monthly EMI and plan your repayment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {/* Loan Amount */}
              <div>
                <Label htmlFor="loan-amount" className="text-sm sm:text-base">Loan Amount</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  className="text-sm sm:text-base"
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-all">
                  Maximum eligible: {formatCurrency(selectedLoan?.maxEligibleAmount || 0)}
                </p>
              </div>

              {/* Tenure */}
              <div>
                <Label htmlFor="tenure" className="text-sm sm:text-base">Repayment Tenure</Label>
                <Select value={tenure} onValueChange={setTenure}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedLoan?.tenureMonths.map((months) => (
                      <SelectItem key={months} value={months.toString()} className="text-sm sm:text-base">
                        {months / 12} years ({months} months)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calculate Button */}
              <Button onClick={handleCalculateEMI} className="w-full text-sm sm:text-base">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate EMI
              </Button>

              {/* Results */}
              {emiAmount > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Monthly EMI</p>
                        <p className="text-lg sm:text-xl font-bold break-all">{formatCurrency(emiAmount)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-lg sm:text-xl font-bold break-all">{formatCurrency(totalInterest)}</p>
                      </CardContent>
                    </Card>
                    <Card className="sm:col-span-2 lg:col-span-1">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <PieChart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Total Repayment</p>
                        <p className="text-lg sm:text-xl font-bold break-all">{formatCurrency(totalRepayment)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Repayment Planner */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        Repayment Planner
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="text-muted-foreground">Loan Amount</span>
                          <span className="font-semibold break-all">{formatCurrency(parseFloat(loanAmount))}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="text-muted-foreground">Interest Rate</span>
                          <span className="font-semibold">{selectedLoan?.interestRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="text-muted-foreground">Tenure</span>
                          <span className="font-semibold">{parseInt(tenure) / 12} years</span>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="text-muted-foreground">Monthly EMI</span>
                          <span className="font-semibold text-primary break-all">{formatCurrency(emiAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="text-muted-foreground">Total Interest</span>
                          <span className="font-semibold text-green-600 break-all">{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2 text-sm sm:text-base">
                          <span className="text-muted-foreground">Total Repayment</span>
                          <span className="font-semibold text-blue-600 break-all">{formatCurrency(totalRepayment)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <Button 
                      onClick={handleApplyForLoan}
                      disabled={isApplying}
                      className="flex-1 h-12 sm:h-10 text-sm sm:text-base font-medium"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {isApplying ? "Applying..." : "Apply for Loan"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 sm:h-10 text-sm sm:text-base font-medium"
                      onClick={() => setSelectedLoan(null)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Save for Later
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Loan Application Success Modal */}
        <Dialog open={isApplicationSuccess} onOpenChange={setIsApplicationSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                Loan Approved!
              </DialogTitle>
              <DialogDescription>
                Your loan has been approved and the amount has been credited to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Application Details</span>
                </div>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Loan Type:</span>
                    <span className="font-medium">{selectedLoan?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(loanAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EMI:</span>
                    <span className="font-medium">{formatCurrency(emiAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">Approved</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">What's Next?</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Loan amount has been credited to your account</li>
                  <li>• Check your dashboard and digital wallet for updated balance</li>
                  <li>• EMI payments will start from next month</li>
                  <li>• You'll receive payment reminders via SMS and email</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleCloseSuccessModal}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Got it!
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleCloseSuccessModal();
                    // Navigate to dashboard or transactions
                  }}
                  className="flex-1"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
