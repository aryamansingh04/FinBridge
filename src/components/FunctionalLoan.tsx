import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { useDebt } from "@/contexts/DebtContext";
import { useNotificationHelpers } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  X,
  ArrowRight,
  AlertTriangle
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

interface LoanApplication {
  id: string;
  loanType: string;
  amount: number;
  tenure: number;
  interestRate: number;
  monthlyEMI: number;
  totalRepayment: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  debtId?: string; // Link to debt when disbursed
}

export const FunctionalLoan = () => {
  const { t } = useTranslation();
  const { walletData, addPendingTransaction, approveLoan } = useWallet();
  const { addDebt, getDebtSummary } = useDebt();
  const { notifyLoan } = useNotificationHelpers();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [emiAmount, setEmiAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [isApplicationSuccess, setIsApplicationSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [loanTransactionId, setLoanTransactionId] = useState<string | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }

    // Load existing loan applications
    const savedApplications = localStorage.getItem('finbridge_loan_applications');
    if (savedApplications) {
      try {
        setLoanApplications(JSON.parse(savedApplications));
      } catch (error) {
        console.error('Error loading loan applications:', error);
      }
    }
  }, []);

  // Save loan applications to localStorage
  useEffect(() => {
    localStorage.setItem('finbridge_loan_applications', JSON.stringify(loanApplications));
  }, [loanApplications]);

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
    const completionRate = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0;
    
    // Calculate debt-to-income ratio
    const debtSummary = getDebtSummary();
    const debtToIncomeRatio = avgMonthlyIncome > 0 ? (debtSummary.totalMonthlyPayments / avgMonthlyIncome) * 100 : 0;
    
    // Base eligibility score
    let eligibilityScore = 0;
    
    // Income factor (40% weight)
    if (avgMonthlyIncome >= 50000) eligibilityScore += 40;
    else if (avgMonthlyIncome >= 30000) eligibilityScore += 30;
    else if (avgMonthlyIncome >= 20000) eligibilityScore += 20;
    else if (avgMonthlyIncome >= 15000) eligibilityScore += 10;
    
    // Transaction history factor (30% weight)
    if (completionRate >= 95) eligibilityScore += 30;
    else if (completionRate >= 90) eligibilityScore += 25;
    else if (completionRate >= 80) eligibilityScore += 20;
    else if (completionRate >= 70) eligibilityScore += 15;
    
    // Debt-to-income ratio factor (20% weight)
    if (debtToIncomeRatio <= 30) eligibilityScore += 20;
    else if (debtToIncomeRatio <= 40) eligibilityScore += 15;
    else if (debtToIncomeRatio <= 50) eligibilityScore += 10;
    else if (debtToIncomeRatio <= 60) eligibilityScore += 5;
    
    // Balance factor (10% weight)
    if (currentBalance >= 100000) eligibilityScore += 10;
    else if (currentBalance >= 50000) eligibilityScore += 8;
    else if (currentBalance >= 25000) eligibilityScore += 5;
    else if (currentBalance >= 10000) eligibilityScore += 3;
    
    const isEligible = eligibilityScore >= 60;
    const maxEligibleAmount = isEligible ? Math.min(avgMonthlyIncome * 10, 5000000) : 0;
    
    return {
      eligibilityScore: Math.round(eligibilityScore),
      isEligible,
      maxEligibleAmount,
      debtToIncomeRatio: Math.round(debtToIncomeRatio)
    };
  };

  const loanTypes: LoanType[] = [
    {
      id: 'home',
      name: t('loan.homeLoan') || 'Home Loan',
      icon: <Home className="w-6 h-6" />,
      description: t('loan.homeLoanDescription') || 'Finance your dream home with competitive rates',
      minAmount: 500000,
      maxAmount: 10000000,
      interestRate: 8.5,
      tenureMonths: [60, 120, 180, 240, 300, 360],
      eligibilityScore: 0,
      isEligible: false,
      maxEligibleAmount: 0,
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 0.5,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Certificate', 'Bank Statements', 'Property Documents']
    },
    {
      id: 'car',
      name: t('loan.carLoan') || 'Car Loan',
      icon: <Car className="w-6 h-6" />,
      description: t('loan.carLoanDescription') || 'Drive your dream car with flexible EMI options',
      minAmount: 100000,
      maxAmount: 2000000,
      interestRate: 9.5,
      tenureMonths: [12, 24, 36, 48, 60, 72],
      eligibilityScore: 0,
      isEligible: false,
      maxEligibleAmount: 0,
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 1.0,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Certificate', 'Bank Statements', 'Driving License']
    },
    {
      id: 'education',
      name: t('loan.educationLoan') || 'Education Loan',
      icon: <GraduationCap className="w-6 h-6" />,
      description: t('loan.educationLoanDescription') || 'Invest in your future with education financing',
      minAmount: 50000,
      maxAmount: 5000000,
      interestRate: 7.5,
      tenureMonths: [60, 120, 180, 240],
      eligibilityScore: 0,
      isEligible: false,
      maxEligibleAmount: 0,
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 0.5,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Admission Letter', 'Fee Structure', 'Academic Records']
    },
    {
      id: 'personal',
      name: t('loan.personalLoan') || 'Personal Loan',
      icon: <CreditCard className="w-6 h-6" />,
      description: t('loan.personalLoanDescription') || 'Meet your personal financial needs instantly',
      minAmount: 25000,
      maxAmount: 1000000,
      interestRate: 12.5,
      tenureMonths: [12, 24, 36, 48, 60],
      eligibilityScore: 0,
      isEligible: false,
      maxEligibleAmount: 0,
      monthlyEMI: 0,
      totalRepayment: 0,
      processingFee: 2.0,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Salary Certificate', 'Bank Statements']
    }
  ];

  // Calculate EMI and update loan types with eligibility
  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const updateLoanCalculations = () => {
    if (!selectedLoan || !loanAmount || !tenure) return;

    const amount = parseFloat(loanAmount);
    const tenureMonths = parseInt(tenure);
    const rate = selectedLoan.interestRate;

    const emi = calculateEMI(amount, rate, tenureMonths);
    const totalRepayment = emi * tenureMonths;
    const totalInterest = totalRepayment - amount;

    setEmiAmount(emi);
    setTotalInterest(totalInterest);
    setTotalRepayment(totalRepayment);
  };

  useEffect(() => {
    updateLoanCalculations();
  }, [selectedLoan, loanAmount, tenure]);

  // Update loan types with eligibility
  useEffect(() => {
    const updatedLoanTypes = loanTypes.map(loan => {
      const eligibility = calculateEligibility(loan.id);
      return {
        ...loan,
        ...eligibility
      };
    });
    // Note: In a real app, you'd update state here
  }, [walletData, userProfile]);

  const handleLoanApplication = async () => {
    if (!selectedLoan || !loanAmount || !tenure) return;

    setIsApplying(true);
    
    try {
      const amount = parseFloat(loanAmount);
      const tenureMonths = parseInt(tenure);
      
      // Create loan application
      const application: LoanApplication = {
        id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        loanType: selectedLoan.name,
        amount,
        tenure: tenureMonths,
        interestRate: selectedLoan.interestRate,
        monthlyEMI: emiAmount,
        totalRepayment,
        status: 'pending',
        appliedDate: new Date().toISOString(),
      };

      // Add to applications
      setLoanApplications(prev => [...prev, application]);

      // Add pending transaction to wallet
      const transactionId = addPendingTransaction({
        type: 'loan_application',
        amount,
        description: `Loan application for ${selectedLoan.name}`,
        category: 'loan',
        emi: emiAmount,
        loanApplicationId: application.id
      });

      setLoanTransactionId(transactionId);
      setIsApplicationSuccess(true);
      setIsApplicationOpen(false);
      
      notifyLoan('applied', amount, selectedLoan.name);
      
      toast({
        title: t('loan.applicationSubmitted') || 'Application Submitted',
        description: t('loan.applicationSubmittedDescription') || 'Your loan application has been submitted successfully',
      });

    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast({
        title: t('loan.applicationError') || 'Application Error',
        description: t('loan.applicationErrorDescription') || 'There was an error submitting your application',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleApproveLoan = (applicationId: string) => {
    const application = loanApplications.find(app => app.id === applicationId);
    if (!application) return;

    // Update application status
    setLoanApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'approved', approvedDate: new Date().toISOString() }
        : app
    ));

    // Approve in wallet
    approveLoan(applicationId);

    notifyLoan('approved', application.amount, application.loanType);
    
    toast({
      title: t('loan.applicationApproved') || 'Application Approved',
      description: t('loan.applicationApprovedDescription') || 'Your loan application has been approved',
    });
  };

  const handleDisburseLoan = (applicationId: string) => {
    const application = loanApplications.find(app => app.id === applicationId);
    if (!application) return;

    // Add loan as debt to debt management system
    const debtId = addDebt({
      creditor: `FinBridge ${application.loanType}`,
      originalAmount: application.amount,
      interestRate: application.interestRate,
      dueDate: new Date(Date.now() + application.tenure * 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: application.loanType,
      description: `Loan disbursement - ${application.loanType}`,
      status: 'active',
      monthlyPayment: application.monthlyEMI,
    });

    // Update application with debt ID and disbursed status
    setLoanApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: 'disbursed', 
            disbursedDate: new Date().toISOString(),
            debtId 
          }
        : app
    ));

    // Add disbursement transaction to wallet
    addPendingTransaction({
      type: 'loan_disbursement',
      amount: application.amount,
      description: `Loan disbursement - ${application.loanType}`,
      category: 'loan',
      loanApplicationId: applicationId
    });

    notifyLoan('disbursed', application.amount, application.loanType);
    
    toast({
      title: t('loan.loanDisbursed') || 'Loan Disbursed',
      description: t('loan.loanDisbursedDescription') || 'Your loan has been disbursed and added to your debt management',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'disbursed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('loan.title') || 'Loan Services'}
          </h1>
          <p className="text-muted-foreground">
            {t('loan.subtitle') || 'Explore and apply for loans tailored to your needs'}
          </p>
        </div>

        {/* Loan Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loanTypes.map((loan) => {
            const eligibility = calculateEligibility(loan.id);
            return (
              <Card 
                key={loan.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  eligibility.isEligible ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
                }`}
                onClick={() => {
                  setSelectedLoan({ ...loan, ...eligibility });
                  setIsPlannerOpen(true);
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {loan.icon}
                    </div>
                    <Badge className={eligibility.isEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {eligibility.isEligible ? t('loan.eligible') || 'Eligible' : t('loan.notEligible') || 'Not Eligible'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{loan.name}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('loan.interestRate') || 'Interest Rate'}</span>
                      <span className="font-semibold">{loan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('loan.maxAmount') || 'Max Amount'}</span>
                      <span className="font-semibold">{formatCurrency(eligibility.maxEligibleAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('loan.eligibilityScore') || 'Eligibility Score'}</span>
                      <span className="font-semibold">{eligibility.eligibilityScore}/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Loan Applications */}
        {loanApplications.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('loan.myApplications') || 'My Loan Applications'}
              </CardTitle>
              <CardDescription>
                {t('loan.applicationsDescription') || 'Track your loan applications and their status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanApplications.map((application) => (
                  <div key={application.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{application.loanType}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t('loan.appliedOn') || 'Applied on'} {formatDate(application.appliedDate)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('loan.amount') || 'Amount'}</p>
                        <p className="font-semibold">{formatCurrency(application.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('loan.tenure') || 'Tenure'}</p>
                        <p className="font-semibold">{application.tenure} {t('loan.months') || 'months'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('loan.monthlyEMI') || 'Monthly EMI'}</p>
                        <p className="font-semibold">{formatCurrency(application.monthlyEMI)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('loan.totalRepayment') || 'Total Repayment'}</p>
                        <p className="font-semibold">{formatCurrency(application.totalRepayment)}</p>
                      </div>
                    </div>

                    {application.status === 'pending' && (
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveLoan(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t('loan.approve') || 'Approve'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            setLoanApplications(prev => prev.map(app => 
                              app.id === application.id 
                                ? { ...app, status: 'rejected' }
                                : app
                            ));
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {t('loan.reject') || 'Reject'}
                        </Button>
                      </div>
                    )}

                    {application.status === 'approved' && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => handleDisburseLoan(application.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          {t('loan.disburse') || 'Disburse Loan'}
                        </Button>
                      </div>
                    )}

                    {application.status === 'disbursed' && application.debtId && (
                      <div className="mt-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            {t('loan.disbursedMessage') || 'Loan has been disbursed and added to your debt management. '}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto"
                              onClick={() => window.location.href = '/debt-repayment'}
                            >
                              {t('loan.manageDebt') || 'Manage Debt'}
                            </Button>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Planner Dialog */}
        <Dialog open={isPlannerOpen} onOpenChange={setIsPlannerOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedLoan?.icon}
                {selectedLoan?.name} {t('loan.planner') || 'Planner'}
              </DialogTitle>
              <DialogDescription>
                {selectedLoan?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedLoan && (
              <div className="space-y-6">
                {/* Eligibility Alert */}
                {!selectedLoan.isEligible && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {t('loan.notEligibleMessage') || 'You are not eligible for this loan. Your eligibility score is too low.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">{t('loan.loanAmount') || 'Loan Amount'}</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="500000"
                      min={selectedLoan.minAmount}
                      max={selectedLoan.maxEligibleAmount}
                      disabled={!selectedLoan.isEligible}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('loan.amountRange') || 'Amount range'}: {formatCurrency(selectedLoan.minAmount)} - {formatCurrency(selectedLoan.maxEligibleAmount)}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="tenure">{t('loan.tenure') || 'Tenure (Months)'}</Label>
                    <Select value={tenure} onValueChange={setTenure} disabled={!selectedLoan.isEligible}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('loan.selectTenure') || 'Select tenure'} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedLoan.tenureMonths.map((months) => (
                          <SelectItem key={months} value={months.toString()}>
                            {months} {t('loan.months') || 'months'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* EMI Calculation */}
                {emiAmount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('loan.emiCalculation') || 'EMI Calculation'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{formatCurrency(emiAmount)}</div>
                          <p className="text-sm text-muted-foreground">{t('loan.monthlyEMI') || 'Monthly EMI'}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalInterest)}</div>
                          <p className="text-sm text-muted-foreground">{t('loan.totalInterest') || 'Total Interest'}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRepayment)}</div>
                          <p className="text-sm text-muted-foreground">{t('loan.totalRepayment') || 'Total Repayment'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsPlannerOpen(false)} className="flex-1">
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button 
                    onClick={() => setIsApplicationOpen(true)} 
                    className="flex-1"
                    disabled={!selectedLoan.isEligible || !loanAmount || !tenure}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t('loan.applyNow') || 'Apply Now'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Application Confirmation Dialog */}
        <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('loan.confirmApplication') || 'Confirm Loan Application'}</DialogTitle>
              <DialogDescription>
                {t('loan.confirmApplicationDescription') || 'Please review your loan application details before submitting'}
              </DialogDescription>
            </DialogHeader>
            
            {selectedLoan && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('loan.loanType') || 'Loan Type'}</p>
                      <p className="font-semibold">{selectedLoan.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('loan.amount') || 'Amount'}</p>
                      <p className="font-semibold">{formatCurrency(parseFloat(loanAmount))}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('loan.tenure') || 'Tenure'}</p>
                      <p className="font-semibold">{tenure} {t('loan.months') || 'months'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('loan.monthlyEMI') || 'Monthly EMI'}</p>
                      <p className="font-semibold">{formatCurrency(emiAmount)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsApplicationOpen(false)} className="flex-1">
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button 
                    onClick={handleLoanApplication} 
                    className="flex-1"
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('loan.applying') || 'Applying...'}
                      </div>
                    ) : (
                      t('loan.submitApplication') || 'Submit Application'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Application Success Dialog */}
        <Dialog open={isApplicationSuccess} onOpenChange={setIsApplicationSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                {t('loan.applicationSubmitted') || 'Application Submitted'}
              </DialogTitle>
              <DialogDescription>
                {t('loan.applicationSubmittedDescription') || 'Your loan application has been submitted successfully'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('loan.applicationInfo') || 'Your application is under review. You will be notified once it\'s processed.'}
                </AlertDescription>
              </Alert>
              
              <Button onClick={() => setIsApplicationSuccess(false)} className="w-full">
                {t('common.ok') || 'OK'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
