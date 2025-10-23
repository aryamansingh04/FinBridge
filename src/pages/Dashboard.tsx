import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useWallet } from "@/contexts/WalletContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  PiggyBank, 
  ShoppingCart, 
  Utensils, 
  Gamepad2, 
  Home, 
  Car, 
  Heart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileText,
  Zap,
  Shield,
  Lightbulb,
  Target,
  CheckSquare,
  TrendingUp,
  Plus
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense' | 'loan_application' | 'debt_payment';
  status?: 'completed' | 'pending' | 'failed';
  emi?: number;
  tenure?: number;
  interestRate?: number;
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface PaymentSchedule {
  id: string;
  title: string;
  amount: number;
  type: 'bill' | 'loan' | 'insurance' | 'subscription' | 'rent';
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  recurring: boolean;
}

const mockTransactions: Transaction[] = [
  { id: '1', amount: 25000, description: 'Monthly Salary', category: 'income', date: '2024-01-15', type: 'income' },
  { id: '2', amount: 1200, description: 'Grocery Shopping', category: 'food', date: '2024-01-14', type: 'expense' },
  { id: '3', amount: 800, description: 'Movie Tickets', category: 'entertainment', date: '2024-01-13', type: 'expense' },
  { id: '4', amount: 5000, description: 'Rent Payment', category: 'necessity', date: '2024-01-12', type: 'expense' },
  { id: '5', amount: 300, description: 'Coffee & Snacks', category: 'food', date: '2024-01-11', type: 'expense' },
  { id: '6', amount: 1500, description: 'Uber Rides', category: 'transportation', date: '2024-01-10', type: 'expense' },
  { id: '7', amount: 2000, description: 'Medical Checkup', category: 'healthcare', date: '2024-01-09', type: 'expense' },
  { id: '8', amount: 600, description: 'Online Shopping', category: 'entertainment', date: '2024-01-08', type: 'expense' },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Loan Application Approved',
    message: 'Your personal loan application has been approved. Amount: ₹50,000',
    type: 'success',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'You received ₹5,000 from John Doe',
    type: 'info',
    timestamp: '2024-01-14T15:45:00Z',
    isRead: false
  },
  {
    id: '3',
    title: 'Budget Alert',
    message: 'You\'re approaching your monthly budget limit',
    type: 'warning',
    timestamp: '2024-01-13T09:20:00Z',
    isRead: true
  },
  {
    id: '4',
    title: 'Credit Score Updated',
    message: 'Your credit score has been updated to 750',
    type: 'info',
    timestamp: '2024-01-12T14:15:00Z',
    isRead: true
  },
  {
    id: '5',
    title: 'Insurance Renewal Due',
    message: 'Your health insurance policy expires in 15 days',
    type: 'warning',
    timestamp: '2024-01-11T11:30:00Z',
    isRead: false
  }
];

const mockPaymentSchedule: PaymentSchedule[] = [
  {
    id: '1',
    title: 'Electricity Bill',
    amount: 2500,
    type: 'bill',
    dueDate: '2024-01-20',
    status: 'pending',
    description: 'Monthly electricity bill payment',
    recurring: true
  },
  {
    id: '2',
    title: 'Home Loan EMI',
    amount: 15000,
    type: 'loan',
    dueDate: '2024-01-25',
    status: 'pending',
    description: 'Monthly home loan EMI payment',
    recurring: true
  },
  {
    id: '3',
    title: 'Car Insurance',
    amount: 8000,
    type: 'insurance',
    dueDate: '2024-01-28',
    status: 'pending',
    description: 'Annual car insurance premium',
    recurring: false
  },
  {
    id: '4',
    title: 'Netflix Subscription',
    amount: 199,
    type: 'subscription',
    dueDate: '2024-01-15',
    status: 'paid',
    description: 'Monthly Netflix subscription',
    recurring: true
  },
  {
    id: '5',
    title: 'Rent Payment',
    amount: 12000,
    type: 'rent',
    dueDate: '2024-01-01',
    status: 'paid',
    description: 'Monthly rent payment',
    recurring: true
  },
  {
    id: '6',
    title: 'Credit Card Bill',
    amount: 3500,
    type: 'bill',
    dueDate: '2024-01-18',
    status: 'pending',
    description: 'Credit card minimum payment',
    recurring: true
  },
  {
    id: '7',
    title: 'Personal Loan EMI',
    amount: 5000,
    type: 'loan',
    dueDate: '2024-01-30',
    status: 'pending',
    description: 'Monthly personal loan EMI',
    recurring: true
  },
  {
    id: '8',
    title: 'Water Bill',
    amount: 800,
    type: 'bill',
    dueDate: '2024-01-22',
    status: 'pending',
    description: 'Monthly water bill payment',
    recurring: true
  }
];

const categoryIcons = {
  income: TrendingUp,
  food: Utensils,
  entertainment: Gamepad2,
  necessity: Home,
  transportation: Car,
  healthcare: Heart,
  shopping: ShoppingCart,
  loan: CreditCard,
  debt_payment: CreditCard,
};

const categoryColors = {
  income: 'bg-green-100 text-green-800',
  food: 'bg-orange-100 text-orange-800',
  entertainment: 'bg-purple-100 text-purple-800',
  necessity: 'bg-blue-100 text-blue-800',
  transportation: 'bg-yellow-100 text-yellow-800',
  healthcare: 'bg-red-100 text-red-800',
  shopping: 'bg-pink-100 text-pink-800',
  loan: 'bg-blue-100 text-blue-800',
  debt_payment: 'bg-red-100 text-red-800',
};

const paymentTypeIcons = {
  bill: Receipt,
  loan: CreditCard,
  insurance: Shield,
  subscription: Zap,
  rent: Home,
};

const paymentTypeColors = {
  bill: 'bg-blue-100 text-blue-800',
  loan: 'bg-purple-100 text-purple-800',
  insurance: 'bg-green-100 text-green-800',
  subscription: 'bg-orange-100 text-orange-800',
  rent: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const { walletData } = useWallet();
  const { notifications, markAsRead, getUnreadCount } = useNotifications();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>(mockPaymentSchedule);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use transactions from wallet context, fallback to mock data if needed
  const transactions = walletData.transactions.length > 0 ? walletData.transactions : mockTransactions;

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  // Calculate financial metrics
  const totalIncome = transactions.filter(t => t.type === 'income' || t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense' || t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = walletData.currentBalance; // Use wallet balance
  const monthlySalary = userProfile ? parseInt(userProfile.monthlySalary.replace(/[^\d]/g, '')) : 0;
  const savingsRate = monthlySalary > 0 ? ((monthlySalary - totalExpenses) / monthlySalary) * 100 : 0;

  // Calculate category-wise expenses
  const categoryExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Generate credit score (mock calculation)
  const creditScore = Math.min(850, Math.max(300, 750 - Math.max(0, (totalExpenses - monthlySalary * 0.7) / 1000)));

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || ShoppingCart;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (category: string) => {
    return t(`transactions.${category}`);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'error': return <X className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('dashboard.justNow');
    if (diffInHours < 24) return t('dashboard.hoursAgo', { hours: diffInHours });
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t('dashboard.daysAgo', { days: diffInDays });
    return date.toLocaleDateString('en-IN');
  };

  const unreadCount = getUnreadCount();
  const recentNotifications = notifications.slice(0, 3);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPaymentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return paymentSchedule.filter(payment => payment.dueDate === dateString);
  };

  const getPaymentIcon = (type: string) => {
    const IconComponent = paymentTypeIcons[type as keyof typeof paymentTypeIcons] || Receipt;
    return <IconComponent className="w-3 h-3" />;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return paymentSchedule
      .filter(payment => {
        const dueDate = new Date(payment.dueDate);
        return dueDate >= today && dueDate <= nextWeek && payment.status === 'pending';
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to FinBridge</h2>
          <p className="text-muted-foreground">Please complete your profile to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('dashboard.welcomeBack', { name: userProfile.name.split(' ')[0] })}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.financialOverview', { month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) })}
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.currentBalance')}</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{currentBalance.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                {currentBalance >= 0 ? '+12%' : '-5%'} from last month
              </p>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.creditScore')}</CardTitle>
              <CreditCard className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{Math.round(creditScore)}</div>
              <p className="text-xs text-muted-foreground">
                {creditScore >= 750 ? t('dashboard.excellent') : creditScore >= 700 ? t('dashboard.good') : t('dashboard.fair')}
              </p>
            </CardContent>
          </Card>

          {/* Monthly Income */}
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.monthlyIncome')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₹{monthlySalary.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                {userProfile.occupation}
              </p>
            </CardContent>
          </Card>

          {/* Savings Rate */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.savingsRate')}</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(savingsRate)}%</div>
              <p className="text-xs text-muted-foreground">
                {savingsRate >= 20 ? t('dashboard.greatJob') : savingsRate >= 10 ? t('dashboard.goodProgress') : t('dashboard.roomForImprovement')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>{t('dashboard.recentNotifications')}</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} {t('dashboard.unread')}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                {t('dashboard.viewAll')}
              </Button>
            </div>
            <CardDescription>{t('dashboard.notificationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    notification.isRead ? 'opacity-75' : ''
                  } ${getNotificationBgColor(notification.type)}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
              {recentNotifications.length === 0 && (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{t('dashboard.noNotifications')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
                <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <CardTitle>{t('dashboard.paymentCalendar')}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{t('dashboard.calendarDescription')}</CardDescription>
                </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: getDaysInMonth(currentDate) }, (_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const payments = getPaymentsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={day}
                        className={`p-2 min-h-[60px] border rounded-lg relative ${
                          isToday ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-gray-900'}`}>
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {payments.slice(0, 2).map((payment) => (
                            <div
                              key={payment.id}
                              className={`flex items-center gap-1 text-xs px-1 py-0.5 rounded ${
                                paymentStatusColors[payment.status]
                              }`}
                              title={`${payment.title} - ${formatCurrency(payment.amount)}`}
                            >
                              {getPaymentIcon(payment.type)}
                              <span className="truncate">{payment.title}</span>
                            </div>
                          ))}
                          {payments.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{payments.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle>{t('dashboard.upcomingPayments')}</CardTitle>
              </div>
              <CardDescription>{t('dashboard.upcomingPaymentsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUpcomingPayments().map((payment) => (
                  <div
                    key={payment.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${paymentTypeColors[payment.type]}`}>
                          {getPaymentIcon(payment.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{payment.title}</h4>
                          <p className="text-xs text-gray-500">{payment.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.dueDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge className={`text-xs ${paymentStatusColors[payment.status]}`}>
                        {payment.status}
                      </Badge>
                      {payment.recurring && (
                        <Badge variant="outline" className="text-xs">
                          {t('dashboard.recurring')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {getUpcomingPayments().length === 0 && (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{t('dashboard.noUpcomingPayments')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Financial Summary and Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* AI Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t('dashboard.aiFinancialSummary')}
              </CardTitle>
              <CardDescription>{t('dashboard.aiFinancialSummaryDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Smart Tip */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">{t('dashboard.smartTip')}</h4>
                    <p className="text-sm text-blue-800">
                      {t('dashboard.smartTipText')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">{t('dashboard.goalProgress')}</h4>
                    <p className="text-sm text-green-800">
                      {t('dashboard.goalProgressText')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Opportunity */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CheckSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-1">{t('dashboard.opportunity')}</h4>
                    <p className="text-sm text-orange-800">
                      {t('dashboard.opportunityText')}
                    </p>
                  </div>
                </div>
              </div>
                </CardContent>
              </Card>

          {/* Financial Health Score */}
              <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t('dashboard.financialHealthScore')}
              </CardTitle>
              <CardDescription>{t('dashboard.financialHealthScoreDescription')}</CardDescription>
                </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">78/100</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500" 
                    style={{ width: '78%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{t('dashboard.goodFinancialHealth')}</p>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PiggyBank className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">{t('dashboard.savingsRate')}</span>
                  </div>
                  <span className="font-bold text-green-600">31%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{t('dashboard.expenseControl')}</span>
                  </div>
                  <span className="font-bold text-blue-600">{t('dashboard.good')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{t('dashboard.creditHealth')}</span>
                  </div>
                  <span className="font-bold text-purple-600">{t('dashboard.excellent')}</span>
                </div>
              </div>
                </CardContent>
              </Card>
            </div>

      </div>
    </div>
  );
};