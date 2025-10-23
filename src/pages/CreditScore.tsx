import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Star,
  Award,
  Zap
} from "lucide-react";

interface CreditFactors {
  paymentHistory: number;
  debtUtilization: number;
  creditAge: number;
  creditMix: number;
  recentInquiries: number;
}

interface CreditRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  icon: React.ReactNode;
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
}

export const CreditScore = () => {
  const { t } = useTranslation();
  const { walletData } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [creditScore, setCreditScore] = useState(0);
  const [creditFactors, setCreditFactors] = useState<CreditFactors>({
    paymentHistory: 0,
    debtUtilization: 0,
    creditAge: 0,
    creditMix: 0,
    recentInquiries: 0
  });
  const [creditGrade, setCreditGrade] = useState('');
  const [recommendations, setRecommendations] = useState<CreditRecommendation[]>([]);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
    
    // Calculate credit score based on financial data
    try {
      calculateCreditScore();
    } catch (error) {
      console.error('Error calculating credit score:', error);
      // Set default values if calculation fails
      setCreditScore(650);
      setCreditGrade('Fair');
      setCreditFactors({
        paymentHistory: 650,
        debtUtilization: 650,
        creditAge: 650,
        creditMix: 650,
        recentInquiries: 650
      });
    }
  }, [walletData]);

  const calculateCreditScore = () => {
    try {
      // Get debt data from localStorage
      const savedDebts = localStorage.getItem('userDebts');
      const debts = savedDebts ? JSON.parse(savedDebts) : [];
      
      // Calculate payment history (35% of score)
      const paymentHistory = calculatePaymentHistory();
      
      // Calculate debt utilization (30% of score)
      const debtUtilization = calculateDebtUtilization(debts);
      
      // Calculate credit age (15% of score)
      const creditAge = calculateCreditAge();
      
      // Calculate credit mix (10% of score)
      const creditMix = calculateCreditMix(debts);
      
      // Calculate recent inquiries (10% of score)
      const recentInquiries = calculateRecentInquiries();
      
      const factors = {
        paymentHistory,
        debtUtilization,
        creditAge,
        creditMix,
        recentInquiries
      };
      
      setCreditFactors(factors);
      
      // Calculate overall credit score (300-850 range)
      const totalScore = Math.round(
        (paymentHistory * 0.35) +
        (debtUtilization * 0.30) +
        (creditAge * 0.15) +
        (creditMix * 0.10) +
        (recentInquiries * 0.10)
      );
      
      setCreditScore(Math.max(300, Math.min(850, totalScore)));
      setCreditGrade(getCreditGrade(totalScore));
      setRecommendations(generateRecommendations(factors, totalScore));
    } catch (error) {
      console.error('Error in calculateCreditScore:', error);
      // Set default values
      setCreditScore(650);
      setCreditGrade('Fair');
      setCreditFactors({
        paymentHistory: 650,
        debtUtilization: 650,
        creditAge: 650,
        creditMix: 650,
        recentInquiries: 650
      });
      setRecommendations([]);
    }
  };

  const calculatePaymentHistory = () => {
    // Analyze transaction history for on-time payments
    const transactions = walletData.transactions || [];
    const totalTransactions = transactions.length;
    
    if (totalTransactions === 0) return 600; // Neutral score for no history
    
    // Count on-time payments (assuming most transactions are on-time)
    const onTimePayments = transactions.filter(t => 
      t.status === 'completed' && 
      (t.type === 'deposit' || t.type === 'income' || t.type === 'loan_application')
    ).length;
    
    const onTimeRate = onTimePayments / totalTransactions;
    return Math.round(300 + (onTimeRate * 500)); // 300-800 range
  };

  const calculateDebtUtilization = (debts: any[]) => {
    if (debts.length === 0) return 750; // Good score for no debt
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.currentAmount, 0);
    const monthlyIncome = userProfile?.monthlySalary ? parseFloat(userProfile.monthlySalary) : 50000;
    const annualIncome = monthlyIncome * 12;
    
    const debtToIncomeRatio = totalDebt / annualIncome;
    
    // Lower ratio = higher score
    if (debtToIncomeRatio <= 0.1) return 800; // Excellent
    if (debtToIncomeRatio <= 0.2) return 700; // Good
    if (debtToIncomeRatio <= 0.3) return 600; // Fair
    if (debtToIncomeRatio <= 0.4) return 500; // Poor
    return 400; // Very Poor
  };

  const calculateCreditAge = () => {
    // Simulate credit age based on account creation
    const accountAge = 12; // months (simulated)
    
    if (accountAge >= 60) return 800; // 5+ years
    if (accountAge >= 36) return 700; // 3-5 years
    if (accountAge >= 24) return 600; // 2-3 years
    if (accountAge >= 12) return 500; // 1-2 years
    return 400; // Less than 1 year
  };

  const calculateCreditMix = (debts: any[]) => {
    if (debts.length === 0) return 600; // Neutral
    
    const creditTypes = new Set(debts.map(debt => debt.category));
    const mixScore = creditTypes.size * 100; // More types = better
    
    return Math.min(800, 400 + mixScore);
  };

  const calculateRecentInquiries = () => {
    // Count recent loan applications
    const recentLoans = walletData.transactions?.filter(t => 
      t.type === 'loan_application' && 
      new Date(t.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
    ).length || 0;
    
    if (recentLoans === 0) return 800; // No recent inquiries
    if (recentLoans === 1) return 700; // One inquiry
    if (recentLoans === 2) return 600; // Two inquiries
    return 500; // Multiple inquiries
  };

  const getCreditGrade = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  const getCreditColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    if (score >= 600) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCreditBadgeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-orange-100 text-orange-800';
      case 'Very Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateRecommendations = (factors: CreditFactors, score: number): CreditRecommendation[] => {
    const recs: CreditRecommendation[] = [];
    
    // Payment History recommendations
    if (factors.paymentHistory < 700) {
      recs.push({
        title: 'Improve Payment History',
        description: 'Make all payments on time. Set up automatic payments for recurring bills.',
        impact: 'high',
        category: 'Payment History',
        icon: <Calendar className="w-4 h-4" />
      });
    }
    
    // Debt Utilization recommendations
    if (factors.debtUtilization < 700) {
      recs.push({
        title: 'Reduce Debt Utilization',
        description: 'Pay down existing debts to improve your debt-to-income ratio.',
        impact: 'high',
        category: 'Debt Management',
        icon: <DollarSign className="w-4 h-4" />
      });
    }
    
    // Credit Age recommendations
    if (factors.creditAge < 600) {
      recs.push({
        title: 'Build Credit History',
        description: 'Keep old accounts open and maintain a long credit history.',
        impact: 'medium',
        category: 'Credit History',
        icon: <Clock className="w-4 h-4" />
      });
    }
    
    // Credit Mix recommendations
    if (factors.creditMix < 600) {
      recs.push({
        title: 'Diversify Credit Types',
        description: 'Consider different types of credit (credit cards, loans, etc.).',
        impact: 'low',
        category: 'Credit Mix',
        icon: <CreditCard className="w-4 h-4" />
      });
    }
    
    // Recent Inquiries recommendations
    if (factors.recentInquiries < 700) {
      recs.push({
        title: 'Limit Credit Applications',
        description: 'Avoid applying for multiple credit products in a short period.',
        impact: 'medium',
        category: 'Credit Inquiries',
        icon: <AlertCircle className="w-4 h-4" />
      });
    }
    
    return recs;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to FinBridge</h2>
              <p className="text-muted-foreground">Please complete your profile to access credit score analysis.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Credit Score Analysis</h1>
            <p className="text-muted-foreground">Understand and improve your creditworthiness</p>
          </div>
          <Button onClick={calculateCreditScore}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Credit Score Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Your Credit Score
              </CardTitle>
              <CardDescription>
                Based on your financial behavior and transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {/* Score Circle */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getCreditColor(creditScore)}`}>
                        {creditScore}
                      </div>
                      <div className="text-sm text-muted-foreground">out of 850</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 w-32 h-32 rounded-full bg-green-200"
                    style={{ 
                      background: `conic-gradient(green ${(creditScore / 850) * 360}deg, #e5e7eb 0deg)` 
                    }}
                  />
                </div>
                
                {/* Grade Badge */}
                <Badge className={`text-lg px-4 py-2 ${getCreditBadgeColor(creditGrade)}`}>
                  {creditGrade}
                </Badge>
                
                {/* Score Range */}
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>300</span>
                    <span>850</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        creditScore >= 750 ? 'bg-green-500' :
                        creditScore >= 700 ? 'bg-blue-500' :
                        creditScore >= 650 ? 'bg-yellow-500' :
                        creditScore >= 600 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(creditScore / 850) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Credit Factors
              </CardTitle>
              <CardDescription>
                How different factors affect your score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment History</span>
                    <span className="font-medium">{creditFactors.paymentHistory}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${(creditFactors.paymentHistory / 850) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Debt Utilization</span>
                    <span className="font-medium">{creditFactors.debtUtilization}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${(creditFactors.debtUtilization / 850) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Credit Age</span>
                    <span className="font-medium">{creditFactors.creditAge}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${(creditFactors.creditAge / 850) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Credit Mix</span>
                    <span className="font-medium">{creditFactors.creditMix}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${(creditFactors.creditMix / 850) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Recent Inquiries</span>
                    <span className="font-medium">{creditFactors.recentInquiries}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${(creditFactors.recentInquiries / 850) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const savedDebts = localStorage.getItem('userDebts');
                  const debts = savedDebts ? JSON.parse(savedDebts) : [];
                  return formatCurrency(debts.reduce((sum: number, debt: any) => sum + debt.currentAmount, 0));
                })()}
              </div>
              <p className="text-xs text-muted-foreground">
                Current outstanding balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(userProfile.monthlySalary ? parseFloat(userProfile.monthlySalary) : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on profile information
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment History</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const transactions = walletData.transactions || [];
                  const totalTransactions = transactions.length;
                  if (totalTransactions === 0) return 'N/A';
                  const onTimePayments = transactions.filter(t => t.status === 'completed').length;
                  return `${Math.round((onTimePayments / totalTransactions) * 100)}%`;
                })()}
              </div>
              <p className="text-xs text-muted-foreground">
                On-time payment rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Credit Improvement Recommendations
            </CardTitle>
            <CardDescription>
              Actionable steps to improve your credit score
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600 mb-2">Excellent Credit Health!</h3>
                <p className="text-muted-foreground">
                  Your credit score is in great shape. Keep up the good financial habits!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-600' :
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <Badge variant={
                            rec.impact === 'high' ? 'destructive' :
                            rec.impact === 'medium' ? 'secondary' : 'default'
                          } className="text-xs">
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{rec.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credit Score Ranges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Credit Score Ranges
            </CardTitle>
            <CardDescription>
              Understanding credit score categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">750-850</div>
                <div className="text-sm font-medium text-green-600">Excellent</div>
                <div className="text-xs text-muted-foreground mt-1">Best rates available</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">700-749</div>
                <div className="text-sm font-medium text-blue-600">Good</div>
                <div className="text-xs text-muted-foreground mt-1">Favorable rates</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">650-699</div>
                <div className="text-sm font-medium text-yellow-600">Fair</div>
                <div className="text-xs text-muted-foreground mt-1">Average rates</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">600-649</div>
                <div className="text-sm font-medium text-orange-600">Poor</div>
                <div className="text-xs text-muted-foreground mt-1">Higher rates</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">300-599</div>
                <div className="text-sm font-medium text-red-600">Very Poor</div>
                <div className="text-xs text-muted-foreground mt-1">Limited options</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
