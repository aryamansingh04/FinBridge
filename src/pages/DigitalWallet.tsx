import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { useNotificationHelpers } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpDown, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Shield, 
  History, 
  Download, 
  HelpCircle,
  CheckCircle,
  AlertCircle,
  DollarSign,
  PiggyBank,
  Calendar,
  Settings,
  MessageCircle,
  BookOpen,
  Phone
} from "lucide-react";

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
  isSignedIn: boolean;
  signInMethod: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  deadline: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  color: string;
}

export const DigitalWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { walletData, updateBalance, addTransaction, setBudgetAmount, addSavingsGoal } = useWallet();
  const { notifyTransaction, notifyWallet } = useNotificationHelpers();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  
  // Quick Actions Modal States
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPayBillsOpen, setIsPayBillsOpen] = useState(false);
  const [isSavingsManagementOpen, setIsSavingsManagementOpen] = useState(false);
  const [isBudgetTrackerOpen, setIsBudgetTrackerOpen] = useState(false);
  
  // Transfer Form States
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferDescription, setTransferDescription] = useState("");
  
  // Pay Bills Form States
  const [billAmount, setBillAmount] = useState("");
  const [billType, setBillType] = useState("");
  const [billProvider, setBillProvider] = useState("");
  
  // Savings Goal Form States
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalMonthly, setNewGoalMonthly] = useState("");
  
  // Budget Management States
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  
  // Security Modal States
  const [isChangePINOpen, setIsChangePINOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isExportStatementOpen, setIsExportStatementOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Security Form States
  const [currentPIN, setCurrentPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  // Use data from wallet context
  const recentTransactions = walletData.transactions.slice(0, 4);
  const savingsGoals = walletData.savingsGoals;
  const budgetCategories = walletData.budgetCategories;

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  }, []);

  // Clear form data when modals open
  useEffect(() => {
    if (isTransferOpen) {
      setTransferAmount("");
      setTransferTo("");
      setTransferDescription("");
    }
  }, [isTransferOpen]);

  useEffect(() => {
    if (isDepositOpen) {
      setDepositAmount("");
    }
  }, [isDepositOpen]);

  useEffect(() => {
    if (isWithdrawOpen) {
      setWithdrawAmount("");
    }
  }, [isWithdrawOpen]);

  useEffect(() => {
    if (isSetBudgetOpen) {
      setSelectedCategory("");
      setNewBudgetAmount("");
    }
  }, [isSetBudgetOpen]);

  useEffect(() => {
    if (isSavingsManagementOpen) {
      setNewGoalName("");
      setNewGoalTarget("");
      setNewGoalMonthly("");
    }
  }, [isSavingsManagementOpen]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && amount <= 100000) {
      updateBalance(amount, 'deposit');
      addTransaction({
        type: 'deposit',
        amount,
        description: 'Wallet Deposit'
      });
      notifyTransaction('deposit', amount, 'Wallet Deposit');
      setDepositAmount("");
      setIsDepositOpen(false);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= walletData.availableBalance) {
      updateBalance(amount, 'withdraw');
      addTransaction({
        type: 'withdraw',
        amount,
        description: 'Wallet Withdrawal'
      });
      notifyTransaction('withdraw', amount, 'Wallet Withdrawal');
      setWithdrawAmount("");
      setIsWithdrawOpen(false);
    }
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= walletData.availableBalance && transferTo.trim()) {
      updateBalance(amount, 'withdraw');
      addTransaction({
        type: 'transfer',
        amount,
        description: `Transfer to ${transferTo}: ${transferDescription || 'Money Transfer'}`
      });
      notifyTransaction('transfer', amount, `Transfer to ${transferTo}`);
      setTransferAmount("");
      setTransferTo("");
      setTransferDescription("");
      setIsTransferOpen(false);
    }
  };

  const handlePayBill = () => {
    const amount = parseFloat(billAmount);
    if (amount > 0 && amount <= walletData.availableBalance && billType.trim()) {
      updateBalance(amount, 'withdraw');
      addTransaction({
        type: 'expense',
        amount,
        description: `${billType} Bill - ${billProvider || 'Utility Bill'}`
      });
      notifyTransaction('payment', amount, `${billType} Bill Payment`);
      setBillAmount("");
      setBillType("");
      setBillProvider("");
      setIsPayBillsOpen(false);
    }
  };

  const handleCreateSavingsGoal = () => {
    const targetAmount = parseFloat(newGoalTarget);
    const monthlyContribution = parseFloat(newGoalMonthly);
    
    // Enhanced validation
    if (newGoalName.trim() && targetAmount >= 1000 && monthlyContribution >= 100) {
      // Create the savings goal
      addSavingsGoal({
        name: newGoalName.trim(),
        targetAmount,
        savedAmount: 0, // Start with 0 saved amount
        monthlyContribution,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 year from now
      });
      
      // Show success notification
      notifyWallet('goal_set', undefined, `Savings goal "${newGoalName.trim()}" created successfully!`);
      
      // Clear form and close modal
      setNewGoalName("");
      setNewGoalTarget("");
      setNewGoalMonthly("");
      setIsSavingsManagementOpen(false);
    }
  };

  const handleSetBudget = () => {
    const amount = parseFloat(newBudgetAmount);
    if (selectedCategory && amount > 0) {
      // Find the category by name and update its budget amount
      const category = budgetCategories.find(cat => cat.name === selectedCategory);
      if (category) {
        setBudgetAmount(category.id, amount);
        notifyWallet('budget_set', undefined, `Budget updated for ${selectedCategory}`);
      }
      setSelectedCategory("");
      setNewBudgetAmount("");
      setIsSetBudgetOpen(false);
    }
  };

  const handleChangePIN = () => {
    if (currentPIN && newPIN && confirmPIN && newPIN === confirmPIN && newPIN.length >= 4) {
      // This would typically update the PIN
      // For now, we'll just close the modal and show success
      setCurrentPIN("");
      setNewPIN("");
      setConfirmPIN("");
      setIsChangePINOpen(false);
    }
  };

  const handleToggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
    setIsBiometricOpen(false);
  };

  const handleExportStatement = () => {
    // This would typically generate and download a statement
    // For now, we'll just close the modal and show success
    setIsExportStatementOpen(false);
  };

  const handleFAQ = () => {
    // Navigate to the FAQ page
    navigate('/faq');
  };

  const handleTutorials = () => {
    // This would typically open tutorials page or section
    toast({
      title: "Tutorials",
      description: "Tutorials section would open here with step-by-step guides.",
    });
  };

  const handleContactSupport = () => {
    // Navigate to the Contact Us page
    navigate('/contact');
  };


  const getProgressPercentage = (saved: number, target: number) => {
    return Math.min((saved / target) * 100, 100);
  };

  const getBudgetProgressPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('digitalWallet.title')}</h1>
            <p className="text-muted-foreground">{t('digitalWallet.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('digitalWallet.currentBalance')}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(walletData.currentBalance)}</div>
              <p className="text-xs text-muted-foreground">
                {t('digitalWallet.availableBalance')}: {formatCurrency(walletData.availableBalance)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('digitalWallet.totalSavings')}</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(walletData.totalSavings)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('digitalWallet.monthlyBudget')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(walletData.monthlyBudget)}</div>
              <p className="text-xs text-muted-foreground">
                ₹12,500 spent this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex-1 h-10 sm:h-auto transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1" />
                      <span className="text-sm font-medium">{t('digitalWallet.deposit')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        {t('digitalWallet.deposit')}
                      </DialogTitle>
                      <DialogDescription>
                        {t('digitalWallet.depositAmount')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deposit-amount" className="text-sm font-medium">
                          {t('digitalWallet.amount')}
                        </Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          placeholder={t('digitalWallet.enterAmount')}
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full h-11 text-lg"
                          autoFocus
                          min="1"
                          max="100000"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            Min: ₹1
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('digitalWallet.maximumAmount')}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={handleDeposit} 
                          className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                          disabled={!depositAmount || parseFloat(depositAmount) < 1 || parseFloat(depositAmount) > 100000}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('digitalWallet.confirm')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsDepositOpen(false)}
                          className="flex-1 sm:flex-none h-11"
                        >
                          {t('digitalWallet.cancel')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-10 sm:h-auto transition-all duration-200 hover:scale-105 active:scale-95 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/20"
                    >
                      <Minus className="w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">{t('digitalWallet.withdraw')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Minus className="w-5 h-5 text-red-600" />
                        {t('digitalWallet.withdraw')}
                      </DialogTitle>
                      <DialogDescription>
                        {t('digitalWallet.withdrawAmount')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="withdraw-amount" className="text-sm font-medium">
                          {t('digitalWallet.amount')}
                        </Label>
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder={t('digitalWallet.enterAmount')}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full h-11 text-lg"
                          autoFocus
                          min="1"
                          max={walletData.availableBalance}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            Available: <span className="font-medium text-green-600">{formatCurrency(walletData.availableBalance)}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Min: ₹1
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={handleWithdraw} 
                          className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                          disabled={!withdrawAmount || parseFloat(withdrawAmount) < 1 || parseFloat(withdrawAmount) > walletData.availableBalance}
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          {t('digitalWallet.confirm')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsWithdrawOpen(false)}
                          className="flex-1 sm:flex-none h-11"
                        >
                          {t('digitalWallet.cancel')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('digitalWallet.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <ArrowUpDown className="w-6 h-6" />
                        <span className="text-sm">{t('digitalWallet.transfer')}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t('digitalWallet.transfer')}</DialogTitle>
                        <DialogDescription>
                          Transfer money to another account or person
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="transfer-amount">{t('digitalWallet.amount')}</Label>
                          <Input
                            id="transfer-amount"
                            type="number"
                            placeholder={t('digitalWallet.enterAmount')}
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full"
                            autoFocus
                          />
                        </div>
                        <div>
                          <Label htmlFor="transfer-to">Transfer To</Label>
                          <Input
                            id="transfer-to"
                            type="text"
                            placeholder="Enter recipient name or account"
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="transfer-description">Description (Optional)</Label>
                          <Input
                            id="transfer-description"
                            type="text"
                            placeholder="Enter description"
                            value={transferDescription}
                            onChange={(e) => setTransferDescription(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleTransfer} className="flex-1">
                            {t('digitalWallet.confirm')}
                          </Button>
                          <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                            {t('digitalWallet.cancel')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isPayBillsOpen} onOpenChange={setIsPayBillsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <CreditCard className="w-6 h-6" />
                        <span className="text-sm">{t('digitalWallet.payBills')}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('digitalWallet.payBills')}</DialogTitle>
                        <DialogDescription>
                          Pay your utility bills and other expenses
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bill-amount">{t('digitalWallet.amount')}</Label>
                          <Input
                            id="bill-amount"
                            type="number"
                            placeholder={t('digitalWallet.enterAmount')}
                            value={billAmount}
                            onChange={(e) => setBillAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bill-type">Bill Type</Label>
                          <Input
                            id="bill-type"
                            type="text"
                            placeholder="e.g., Electricity, Water, Internet"
                            value={billType}
                            onChange={(e) => setBillType(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bill-provider">Provider (Optional)</Label>
                          <Input
                            id="bill-provider"
                            type="text"
                            placeholder="e.g., BESCOM, BWSSB"
                            value={billProvider}
                            onChange={(e) => setBillProvider(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handlePayBill} className="flex-1">
                            {t('digitalWallet.confirm')}
                          </Button>
                          <Button variant="outline" onClick={() => setIsPayBillsOpen(false)}>
                            {t('digitalWallet.cancel')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isSavingsManagementOpen} onOpenChange={setIsSavingsManagementOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Target className="w-6 h-6" />
                        <span className="text-sm">{t('digitalWallet.savingsManagement')}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t('digitalWallet.savingsManagement')}</DialogTitle>
                        <DialogDescription>
                          Create and manage your savings goals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goal-name">Goal Name</Label>
                          <Input
                            id="goal-name"
                            type="text"
                            placeholder="e.g., Emergency Fund, Vacation"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            className="w-full"
                            autoFocus
                          />
                        </div>
                        <div>
                          <Label htmlFor="goal-target">{t('digitalWallet.targetAmount')}</Label>
                          <Input
                            id="goal-target"
                            type="number"
                            placeholder="Enter target amount"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            className="w-full"
                            min="1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum amount: ₹1,000
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="goal-monthly">{t('digitalWallet.monthlyContribution')}</Label>
                          <Input
                            id="goal-monthly"
                            type="number"
                            placeholder="Enter monthly contribution"
                            value={newGoalMonthly}
                            onChange={(e) => setNewGoalMonthly(e.target.value)}
                            className="w-full"
                            min="1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum contribution: ₹100/month
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleCreateSavingsGoal} 
                            className="flex-1"
                            disabled={!newGoalName.trim() || !newGoalTarget || !newGoalMonthly || 
                                     parseFloat(newGoalTarget) < 1000 || parseFloat(newGoalMonthly) < 100}
                          >
                            {t('digitalWallet.createGoal')}
                          </Button>
                          <Button variant="outline" onClick={() => setIsSavingsManagementOpen(false)}>
                            {t('digitalWallet.cancel')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setIsBudgetTrackerOpen(true)}
                  >
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm">{t('digitalWallet.budgetTracker')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Savings Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('digitalWallet.savingsGoals')}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsSavingsManagementOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('digitalWallet.createGoal')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingsGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(goal.savedAmount, goal.targetAmount)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(getProgressPercentage(goal.savedAmount, goal.targetAmount))}% complete</span>
                      <span>₹{goal.monthlyContribution}/month</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Budget Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('digitalWallet.budgetTracker')}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsSetBudgetOpen(true)}
                    className="h-8 sm:h-auto px-2 sm:px-3 py-1 sm:py-1 text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Settings className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">{t('digitalWallet.setBudget')}</span>
                    <span className="sm:hidden">Set</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(category.spentAmount)} / {formatCurrency(category.budgetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={getBudgetProgressPercentage(category.spentAmount, category.budgetAmount)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {Math.round(getBudgetProgressPercentage(category.spentAmount, category.budgetAmount))}% used
                      </span>
                      <span>
                        {formatCurrency(category.budgetAmount - category.spentAmount)} remaining
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    <span className="text-lg font-semibold">{t('digitalWallet.recentTransactions')}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate('/transactions')}
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-200 flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">{t('digitalWallet.viewAll')}</span>
                    <span className="sm:hidden">View All</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.slice(0, 4).map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate('/transactions')}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                        transaction.type === 'withdraw' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'deposit' ? <Plus className="w-4 h-4" /> :
                         transaction.type === 'withdraw' ? <Minus className="w-4 h-4" /> :
                         <ArrowUpDown className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className={`font-medium text-sm ${
                        transaction.type === 'deposit' ? 'text-green-600' :
                        transaction.type === 'withdraw' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : transaction.type === 'withdraw' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'} 
                        className="text-xs mt-1"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="text-center py-6">
                    <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent transactions</p>
                    <p className="text-xs text-muted-foreground mt-1">Start by making a deposit or transfer</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security & Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('digitalWallet.security')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-10 sm:h-auto px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsChangePINOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('digitalWallet.changePIN')}</span>
                  <span className="sm:hidden">Change PIN</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-10 sm:h-auto px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsBiometricOpen(true)}
                >
                  <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{biometricEnabled ? 'Disable Biometric' : t('digitalWallet.enableBiometric')}</span>
                  <span className="sm:hidden">{biometricEnabled ? 'Disable' : 'Enable'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-10 sm:h-auto px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsExportStatementOpen(true)}
                >
                  <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('digitalWallet.exportStatement')}</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-10 sm:h-auto px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsHelpOpen(true)}
                >
                  <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('digitalWallet.help')}</span>
                  <span className="sm:hidden">Help</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* All Modals - Always Available */}
      {/* Budget Tracker Modal */}
      <Dialog open={isBudgetTrackerOpen} onOpenChange={setIsBudgetTrackerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('digitalWallet.budgetTracker')}</DialogTitle>
            <DialogDescription>
              View and manage your monthly budget categories
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              {budgetCategories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(category.spentAmount)} / {formatCurrency(category.budgetAmount)}
                    </span>
                  </div>
                  <Progress 
                    value={getBudgetProgressPercentage(category.spentAmount, category.budgetAmount)} 
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {Math.round(getBudgetProgressPercentage(category.spentAmount, category.budgetAmount))}% used
                    </span>
                    <span>
                      {formatCurrency(category.budgetAmount - category.spentAmount)} remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsBudgetTrackerOpen(false)} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Budget Modal */}
      <Dialog open={isSetBudgetOpen} onOpenChange={setIsSetBudgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('digitalWallet.setBudget')}</DialogTitle>
            <DialogDescription>
              Set or update your monthly budget for different categories
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget-category">Select Category</Label>
              <select
                id="budget-category"
                className="w-full p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {budgetCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="budget-amount">{t('digitalWallet.budgetAmount')}</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="Enter budget amount"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleSetBudget} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('digitalWallet.setBudget')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSetBudgetOpen(false)}
                className="h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('digitalWallet.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change PIN Modal */}
      <Dialog open={isChangePINOpen} onOpenChange={setIsChangePINOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('digitalWallet.changePIN')}</DialogTitle>
            <DialogDescription>
              Change your wallet PIN for enhanced security
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-pin">Current PIN</Label>
              <Input
                id="current-pin"
                type="password"
                placeholder="Enter current PIN"
                value={currentPIN}
                onChange={(e) => setCurrentPIN(e.target.value)}
                maxLength={6}
              />
            </div>
            <div>
              <Label htmlFor="new-pin">New PIN</Label>
              <Input
                id="new-pin"
                type="password"
                placeholder="Enter new PIN (4-6 digits)"
                value={newPIN}
                onChange={(e) => setNewPIN(e.target.value)}
                maxLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirm-pin">Confirm New PIN</Label>
              <Input
                id="confirm-pin"
                type="password"
                placeholder="Confirm new PIN"
                value={confirmPIN}
                onChange={(e) => setConfirmPIN(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleChangePIN} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Change PIN
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsChangePINOpen(false)}
                className="h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('digitalWallet.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Biometric Modal */}
      <Dialog open={isBiometricOpen} onOpenChange={setIsBiometricOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{biometricEnabled ? 'Disable Biometric' : t('digitalWallet.enableBiometric')}</DialogTitle>
            <DialogDescription>
              {biometricEnabled 
                ? 'Disable biometric authentication for your wallet'
                : 'Enable biometric authentication for quick and secure access'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4">
              <Shield className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                {biometricEnabled 
                  ? 'Biometric authentication is currently enabled'
                  : 'Use your fingerprint or face ID for secure access'
                }
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleToggleBiometric} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline">{biometricEnabled ? 'Disable' : 'Enable'} Biometric</span>
                <span className="sm:hidden">{biometricEnabled ? 'Disable' : 'Enable'}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsBiometricOpen(false)}
                className="h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('digitalWallet.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Statement Modal */}
      <Dialog open={isExportStatementOpen} onOpenChange={setIsExportStatementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('digitalWallet.exportStatement')}</DialogTitle>
            <DialogDescription>
              Download your transaction statement for the selected period
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4">
              <Download className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Your statement will be downloaded as a PDF file
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleExportStatement} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline">Download Statement</span>
                <span className="sm:hidden">Download</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsExportStatementOpen(false)}
                className="h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('digitalWallet.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('digitalWallet.help')}</DialogTitle>
            <DialogDescription>
              Get help and support for your digital wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/5"
                onClick={handleFAQ}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">{t('digitalWallet.faq')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Find answers to frequently asked questions about using your digital wallet.
                    </p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/5"
                onClick={handleTutorials}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">{t('digitalWallet.tutorials')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Learn how to use all features of your digital wallet with step-by-step tutorials.
                    </p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/5"
                onClick={handleContactSupport}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">{t('digitalWallet.contactSupport')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Contact our support team for personalized assistance with your wallet.
                    </p>
                  </div>
                </div>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsHelpOpen(false)} 
                className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
