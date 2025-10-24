import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { useDebt, Debt } from "@/contexts/DebtContext";
import { useNotificationHelpers } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Plus, 
  Calendar,
  TrendingUp,
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Trash2,
  Edit,
  ArrowUpDown,
  X
} from "lucide-react";


export const FunctionalDebtRepayment = () => {
  const { t } = useTranslation();
  const { walletData, updateBalance, addTransaction } = useWallet();
  const { 
    debts, 
    payments, 
    addDebt, 
    updateDebt, 
    deleteDebt, 
    makePayment, 
    calculateRepaymentPlan,
    calculateDebtSnowball,
    calculateDebtAvalanche,
    getDebtSummary
  } = useDebt();
  const { notifyDebt } = useNotificationHelpers();

  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  
  
  
  
  
  // Add Debt Form States
  const [newDebt, setNewDebt] = useState({
    creditor: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    category: "",
    description: "",
    monthlyPayment: ""
  });

  const debtSummary = getDebtSummary();

  const handleAddDebt = () => {
    if (!newDebt.creditor || !newDebt.amount || !newDebt.interestRate) {
      return;
    }

    addDebt({
      creditor: newDebt.creditor,
      originalAmount: parseFloat(newDebt.amount),
      interestRate: parseFloat(newDebt.interestRate),
      dueDate: newDebt.dueDate,
      category: newDebt.category,
      description: newDebt.description,
      status: 'active',
      monthlyPayment: newDebt.monthlyPayment ? parseFloat(newDebt.monthlyPayment) : undefined,
    });

    // Reset form
    setNewDebt({
      creditor: "",
      amount: "",
      interestRate: "",
      dueDate: "",
      category: "",
      description: "",
      monthlyPayment: ""
    });
    setIsAddDebtOpen(false);
    
    notifyDebt('added', parseFloat(newDebt.amount), newDebt.creditor);
  };

  const handleMakePayment = () => {
    if (!selectedDebt || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedDebt.currentAmount) return;

    // Check if user has sufficient balance
    if (amount > walletData.currentBalance) {
      alert(t('digitalWallet.insufficientBalance') || 'Insufficient balance');
      return;
    }

    makePayment(selectedDebt.id, amount, `Payment to ${selectedDebt.creditor}`);
    
    // Update wallet balance
    updateBalance(amount, 'withdraw');
    
    // Add transaction to wallet
    addTransaction({
      type: 'debt_payment',
      amount: amount,
      description: `Debt payment to ${selectedDebt.creditor}`,
      category: 'debt_repayment',
    });

    setPaymentAmount("");
    setIsPaymentOpen(false);
    setSelectedDebt(null);
    
    notifyDebt('paid', amount, selectedDebt.creditor);
  };

  const handleDeleteDebt = (debtId: string) => {
    if (confirm(t('debtRepayment.confirmDelete') || 'Are you sure you want to delete this debt?')) {
      deleteDebt(debtId);
    }
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
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
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
            {t('debtRepayment.title') || 'Debt Repayment Planner'}
          </h1>
          <p className="text-muted-foreground">
            {t('debtRepayment.subtitle') || 'Manage and track your debt repayment progress'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('debtRepayment.totalDebt') || 'Total Debt'}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(debtSummary.totalDebt)}</div>
              <p className="text-xs text-muted-foreground">
                {debtSummary.activeDebts} {t('debtRepayment.activeDebts') || 'active debts'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('debtRepayment.monthlyPayments') || 'Monthly Payments'}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(debtSummary.totalMonthlyPayments)}</div>
              <p className="text-xs text-muted-foreground">
                {t('debtRepayment.totalMonthly') || 'Total monthly payments'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('debtRepayment.avgInterestRate') || 'Avg Interest Rate'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{debtSummary.averageInterestRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {t('debtRepayment.averageRate') || 'Average interest rate'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('debtRepayment.totalInterest') || 'Total Interest'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(debtSummary.totalInterest)}</div>
              <p className="text-xs text-muted-foreground">
                {t('debtRepayment.interestToPay') || 'Interest to pay'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('debtRepayment.addDebt') || 'Add Debt'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('debtRepayment.addNewDebt') || 'Add New Debt'}</DialogTitle>
                <DialogDescription>
                  {t('debtRepayment.addDebtDescription') || 'Enter the details of your debt to track it'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="creditor">{t('debtRepayment.creditor') || 'Creditor'}</Label>
                  <Input
                    id="creditor"
                    value={newDebt.creditor}
                    onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                    placeholder={t('debtRepayment.creditorPlaceholder') || 'e.g., HDFC Bank'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">{t('debtRepayment.amount') || 'Amount'}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="interestRate">{t('debtRepayment.interestRate') || 'Interest Rate (%)'}</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                    placeholder="12.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">{t('debtRepayment.category') || 'Category'}</Label>
                  <Select value={newDebt.category} onValueChange={(value) => setNewDebt({...newDebt, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('debtRepayment.selectCategory') || 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">{t('debtRepayment.creditCard') || 'Credit Card'}</SelectItem>
                      <SelectItem value="Personal Loan">{t('debtRepayment.personalLoan') || 'Personal Loan'}</SelectItem>
                      <SelectItem value="Home Loan">{t('debtRepayment.homeLoan') || 'Home Loan'}</SelectItem>
                      <SelectItem value="Car Loan">{t('debtRepayment.carLoan') || 'Car Loan'}</SelectItem>
                      <SelectItem value="Education Loan">{t('debtRepayment.educationLoan') || 'Education Loan'}</SelectItem>
                      <SelectItem value="Other">{t('debtRepayment.other') || 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">{t('debtRepayment.dueDate') || 'Due Date'}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyPayment">{t('debtRepayment.monthlyPayment') || 'Monthly Payment (Optional)'}</Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    value={newDebt.monthlyPayment}
                    onChange={(e) => setNewDebt({...newDebt, monthlyPayment: e.target.value})}
                    placeholder="5000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{t('debtRepayment.description') || 'Description'}</Label>
                  <Input
                    id="description"
                    value={newDebt.description}
                    onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                    placeholder={t('debtRepayment.descriptionPlaceholder') || 'Optional description'}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDebtOpen(false)} className="flex-1">
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button onClick={handleAddDebt} className="flex-1">
                    {t('debtRepayment.addDebt') || 'Add Debt'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>

        {/* Debts List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('debtRepayment.yourDebts') || 'Your Debts'}</h2>
          
          {debts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('debtRepayment.noDebts') || 'No Debts Found'}</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {t('debtRepayment.noDebtsDescription') || 'You don\'t have any debts tracked yet. Add your first debt to get started.'}
                </p>
                <Button onClick={() => setIsAddDebtOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('debtRepayment.addFirstDebt') || 'Add Your First Debt'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {debts.map((debt) => {
                const progress = ((debt.originalAmount - debt.currentAmount) / debt.originalAmount) * 100;
                
                return (
                  <Card key={debt.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {debt.creditor}
                            <Badge className={getStatusColor(debt.status)}>
                              {debt.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{debt.category} • {debt.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDebt(debt);
                              setIsPaymentOpen(true);
                            }}
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            {t('debtRepayment.makePayment') || 'Pay'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDebt(debt.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('debtRepayment.originalAmount') || 'Original Amount'}</p>
                            <p className="font-semibold">{formatCurrency(debt.originalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('debtRepayment.currentAmount') || 'Current Amount'}</p>
                            <p className="font-semibold">{formatCurrency(debt.currentAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('debtRepayment.interestRate') || 'Interest Rate'}</p>
                            <p className="font-semibold">{debt.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('debtRepayment.dueDate') || 'Due Date'}</p>
                            <p className="font-semibold">{formatDate(debt.dueDate)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{t('debtRepayment.repaymentProgress') || 'Repayment Progress'}</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        {debt.monthlyPayment && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{t('debtRepayment.monthlyPayment') || 'Monthly Payment'}: {formatCurrency(debt.monthlyPayment)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('debtRepayment.makePayment') || 'Make Payment'}</DialogTitle>
              <DialogDescription>
                {selectedDebt && `${t('debtRepayment.paymentTo') || 'Payment to'} ${selectedDebt.creditor}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedDebt && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('debtRepayment.currentAmount') || 'Current Amount'}</p>
                      <p className="font-semibold">{formatCurrency(selectedDebt.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('debtRepayment.availableBalance') || 'Available Balance'}</p>
                      <p className="font-semibold">{formatCurrency(walletData.currentBalance)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentAmount">{t('debtRepayment.paymentAmount') || 'Payment Amount'}</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="5000"
                    max={selectedDebt.currentAmount}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="flex-1">
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button 
                    onClick={handleMakePayment} 
                    className="flex-1"
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > selectedDebt.currentAmount}
                  >
                    {t('debtRepayment.makePayment') || 'Make Payment'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
