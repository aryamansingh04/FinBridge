import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Plus, 
  Calculator, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from "lucide-react";

interface Debt {
  id: string;
  creditor: string;
  originalAmount: number;
  currentAmount: number;
  interestRate: number;
  dueDate: string;
  category: string;
  description: string;
  status: 'active' | 'paid' | 'overdue';
  monthlyPayment?: number;
  totalInterest?: number;
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
}

export const DebtRepayment = () => {
  const { t } = useTranslation();
  const { walletData, addTransaction } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [plannerPaymentAmount, setPlannerPaymentAmount] = useState("");
  
  // Add Debt Form States
  const [newDebt, setNewDebt] = useState({
    creditor: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    category: "",
    description: ""
  });

  // Planner States
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");

  // Mock debt data - in real app, this would come from API
  const mockDebts: Debt[] = [
    {
      id: '1',
      creditor: 'HDFC Bank',
      originalAmount: 50000,
      currentAmount: 45000,
      interestRate: 12.5,
      dueDate: '2024-06-15',
      category: 'Credit Card',
      description: 'Credit card outstanding balance',
      status: 'active',
      monthlyPayment: 5000,
      totalInterest: 15000
    },
    {
      id: '2',
      creditor: 'SBI Personal Loan',
      originalAmount: 200000,
      currentAmount: 180000,
      interestRate: 14.0,
      dueDate: '2025-03-20',
      category: 'Personal Loan',
      description: 'Personal loan for home renovation',
      status: 'active',
      monthlyPayment: 15000,
      totalInterest: 45000
    },
    {
      id: '3',
      creditor: 'Friend - Rajesh',
      originalAmount: 25000,
      currentAmount: 25000,
      interestRate: 0,
      dueDate: '2024-08-30',
      category: 'Personal',
      description: 'Borrowed for emergency expenses',
      status: 'active',
      monthlyPayment: 5000,
      totalInterest: 0
    }
  ];

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
    
    // Load debts from localStorage or use mock data
    const savedDebts = localStorage.getItem('userDebts');
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts));
    } else {
      setDebts(mockDebts);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Credit Card': return <CreditCard className="w-4 h-4" />;
      case 'Personal Loan': return <TrendingUp className="w-4 h-4" />;
      case 'Personal': return <DollarSign className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.currentAmount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + (debt.monthlyPayment || 0), 0);
  };

  const handleAddDebt = () => {
    if (!newDebt.creditor || !newDebt.amount || !newDebt.dueDate) {
      return;
    }

    const debt: Debt = {
      id: Date.now().toString(),
      creditor: newDebt.creditor,
      originalAmount: parseFloat(newDebt.amount),
      currentAmount: parseFloat(newDebt.amount),
      interestRate: parseFloat(newDebt.interestRate) || 0,
      dueDate: newDebt.dueDate,
      category: newDebt.category || 'Other',
      description: newDebt.description,
      status: 'active',
      monthlyPayment: 0,
      totalInterest: 0
    };

    const updatedDebts = [...debts, debt];
    setDebts(updatedDebts);
    localStorage.setItem('userDebts', JSON.stringify(updatedDebts));

    // Reset form
    setNewDebt({
      creditor: "",
      amount: "",
      interestRate: "",
      dueDate: "",
      category: "",
      description: ""
    });
    setIsAddDebtOpen(false);
  };

  const handleMakePayment = (debt: Debt, amount: number) => {
    // Add payment transaction
    addTransaction({
      type: "expense",
      amount: amount,
      description: `Debt payment to ${debt.creditor}`,
      category: "debt_payment",
    });

    // Update debt amount
    const updatedDebts = debts.map(d => 
      d.id === debt.id 
        ? { ...d, currentAmount: Math.max(0, d.currentAmount - amount) }
        : d
    );
    setDebts(updatedDebts);
    localStorage.setItem('userDebts', JSON.stringify(updatedDebts));
    
    // Close modal and reset
    setIsPaymentOpen(false);
    setPaymentAmount("");
    setSelectedDebt(null);
  };

  const openPaymentModal = (debt: Debt) => {
    setSelectedDebt(debt);
    setPaymentAmount("");
    setIsPaymentOpen(true);
  };

  const openPlannerModal = (debt: Debt) => {
    setSelectedDebt(debt);
    setPlannerPaymentAmount("");
    setIsPlannerOpen(true);
  };

  const calculateRepaymentPlan = (debt: Debt, monthlyPayment: number) => {
    if (monthlyPayment <= 0) return null;

    const monthlyRate = debt.interestRate / 100 / 12;
    let remainingAmount = debt.currentAmount;
    let totalInterest = 0;
    let months = 0;

    while (remainingAmount > 0 && months < 120) { // Max 10 years
      const interestPayment = remainingAmount * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, remainingAmount);
      
      totalInterest += interestPayment;
      remainingAmount -= principalPayment;
      months++;
    }

    return {
      months,
      totalInterest,
      finalPayment: remainingAmount
    };
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to FinBridge</h2>
          <p className="text-muted-foreground">Please complete your profile to access debt management.</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Debt Repayment</h1>
            <p className="text-muted-foreground">Manage and track your debt payments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsPlannerOpen(true)}>
              <Calculator className="w-4 h-4 mr-2" />
              Repayment Planner
            </Button>
            <Button onClick={() => setIsAddDebtOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Debt
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(calculateTotalDebt())}</div>
              <p className="text-xs text-muted-foreground">
                Across {debts.length} debt{debts.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(calculateMonthlyPayments())}</div>
              <p className="text-xs text-muted-foreground">
                Total monthly commitment
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Debt List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Debts</h2>
          {debts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No debts found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any active debts. Add a debt to start tracking your payments.
                </p>
                <Button onClick={() => setIsAddDebtOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Debt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {debts.map((debt) => (
                <Card key={debt.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getCategoryIcon(debt.category)}
                          <h3 className="text-lg font-semibold">{debt.creditor}</h3>
                          <Badge className={getStatusColor(debt.status)}>
                            {debt.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{debt.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Amount</p>
                            <p className="font-semibold">{formatCurrency(debt.currentAmount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interest Rate</p>
                            <p className="font-semibold">{debt.interestRate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-semibold">{new Date(debt.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Payment</p>
                            <p className="font-semibold">{formatCurrency(debt.monthlyPayment || 0)}</p>
                          </div>
                        </div>

                        {debt.currentAmount > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{((debt.originalAmount - debt.currentAmount) / debt.originalAmount * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={(debt.originalAmount - debt.currentAmount) / debt.originalAmount * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => openPlannerModal(debt)}
                          variant="outline"
                          size="sm"
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Plan Payment
                        </Button>
                        <Button 
                          onClick={() => openPaymentModal(debt)}
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Debt Modal */}
        <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
              <DialogDescription>
                Add a new debt to track and manage your payments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="creditor">Creditor Name</Label>
                <Input
                  id="creditor"
                  value={newDebt.creditor}
                  onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                  placeholder="e.g., HDFC Bank, Friend Name"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                  placeholder="50000"
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
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
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newDebt.category} onValueChange={(value) => setNewDebt({...newDebt, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                    <SelectItem value="Home Loan">Home Loan</SelectItem>
                    <SelectItem value="Car Loan">Car Loan</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                  placeholder="Brief description of the debt"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddDebt} className="flex-1">
                  Add Debt
                </Button>
                <Button variant="outline" onClick={() => setIsAddDebtOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Repayment Planner Modal */}
        <Dialog open={isPlannerOpen} onOpenChange={setIsPlannerOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Debt Repayment Planner</DialogTitle>
              <DialogDescription>
                Plan your debt repayment strategy and see how different payment amounts affect your timeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {selectedDebt && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Debt: {selectedDebt.creditor}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Current Amount</p>
                      <p className="font-semibold text-blue-900">{formatCurrency(selectedDebt.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Interest Rate</p>
                      <p className="font-semibold text-blue-900">{selectedDebt.interestRate}% p.a.</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="plannerPaymentAmount">Monthly Payment Amount</Label>
                <Input
                  id="plannerPaymentAmount"
                  type="number"
                  value={plannerPaymentAmount}
                  onChange={(e) => setPlannerPaymentAmount(e.target.value)}
                  placeholder="Enter monthly payment amount"
                />
                
                {/* Quick payment amount buttons */}
                {selectedDebt && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlannerPaymentAmount((selectedDebt.currentAmount / 12).toString())}
                    >
                      1 Year
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlannerPaymentAmount((selectedDebt.currentAmount / 24).toString())}
                    >
                      2 Years
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlannerPaymentAmount((selectedDebt.currentAmount / 36).toString())}
                    >
                      3 Years
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlannerPaymentAmount((selectedDebt.currentAmount / 60).toString())}
                    >
                      5 Years
                    </Button>
                  </div>
                )}
                
                {plannerPaymentAmount && selectedDebt && parseFloat(plannerPaymentAmount) > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    This will pay off your debt in approximately {Math.ceil(selectedDebt.currentAmount / parseFloat(plannerPaymentAmount))} months
                  </p>
                )}
              </div>

              {plannerPaymentAmount && selectedDebt && parseFloat(plannerPaymentAmount) > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Repayment Plan</h4>
                  {(() => {
                    const plan = calculateRepaymentPlan(selectedDebt, parseFloat(plannerPaymentAmount));
                    if (!plan) return <p className="text-red-600">Invalid payment amount</p>;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-green-700">Time to Pay Off</p>
                            <p className="font-semibold text-green-900">
                              {plan.months} month{plan.months !== 1 ? 's' : ''} 
                              ({Math.floor(plan.months / 12)} year{Math.floor(plan.months / 12) !== 1 ? 's' : ''})
                            </p>
                          </div>
                          <div>
                            <p className="text-green-700">Total Interest</p>
                            <p className="font-semibold text-green-900">{formatCurrency(plan.totalInterest)}</p>
                          </div>
                          <div>
                            <p className="text-green-700">Total Payment</p>
                            <p className="font-semibold text-green-900">
                              {formatCurrency(selectedDebt.currentAmount + plan.totalInterest)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Monthly breakdown */}
                        <div className="bg-white border border-green-200 rounded-lg p-3">
                          <h5 className="font-medium text-green-900 mb-2">Monthly Breakdown</h5>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-green-700">Principal Payment</p>
                              <p className="font-semibold text-green-900">
                                {formatCurrency(parseFloat(plannerPaymentAmount) - (selectedDebt.currentAmount * selectedDebt.interestRate / 100 / 12))}
                              </p>
                            </div>
                            <div>
                              <p className="text-green-700">Interest Payment</p>
                              <p className="font-semibold text-green-900">
                                {formatCurrency(selectedDebt.currentAmount * selectedDebt.interestRate / 100 / 12)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Savings comparison */}
                        {selectedDebt.monthlyPayment && selectedDebt.monthlyPayment !== parseFloat(plannerPaymentAmount) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 mb-2">Savings Comparison</h5>
                            <div className="text-xs text-blue-700">
                              {parseFloat(plannerPaymentAmount) > selectedDebt.monthlyPayment ? (
                                <p>Paying {formatCurrency(parseFloat(plannerPaymentAmount) - selectedDebt.monthlyPayment)} more per month will save you {formatCurrency(plan.totalInterest - (selectedDebt.currentAmount * selectedDebt.interestRate / 100 / 12 * plan.months))} in interest!</p>
                              ) : (
                                <p>This payment plan will extend your repayment period but reduce monthly burden.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (plannerPaymentAmount && selectedDebt && parseFloat(plannerPaymentAmount) > 0) {
                      // Update the debt with the new monthly payment
                      const updatedDebts = debts.map(d => 
                        d.id === selectedDebt.id 
                          ? { ...d, monthlyPayment: parseFloat(plannerPaymentAmount) }
                          : d
                      );
                      setDebts(updatedDebts);
                      localStorage.setItem('userDebts', JSON.stringify(updatedDebts));
                      
                      // Close modal and reset
                      setIsPlannerOpen(false);
                      setPlannerPaymentAmount("");
                      setSelectedDebt(null);
                    }
                  }}
                  disabled={!plannerPaymentAmount || isNaN(parseFloat(plannerPaymentAmount)) || parseFloat(plannerPaymentAmount) <= 0}
                  className="flex-1"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set as Monthly Payment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsPlannerOpen(false);
                    setPlannerPaymentAmount("");
                    setSelectedDebt(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Make Payment Modal */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
              <DialogDescription>
                Enter the payment amount for {selectedDebt?.creditor}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDebt && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Creditor:</span>
                      <span className="font-semibold text-blue-900">{selectedDebt.creditor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Current Amount:</span>
                      <span className="font-semibold text-blue-900">{formatCurrency(selectedDebt.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Interest Rate:</span>
                      <span className="font-semibold text-blue-900">{selectedDebt.interestRate}% p.a.</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="paymentAmountInput">Payment Amount</Label>
                <Input
                  id="paymentAmountInput"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  className="text-lg"
                />
                {paymentAmount && parseFloat(paymentAmount) > 0 && selectedDebt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Remaining amount after payment: {formatCurrency(Math.max(0, selectedDebt.currentAmount - parseFloat(paymentAmount)))}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (paymentAmount && !isNaN(parseFloat(paymentAmount)) && parseFloat(paymentAmount) > 0 && selectedDebt) {
                      handleMakePayment(selectedDebt, parseFloat(paymentAmount));
                    }
                  }}
                  disabled={!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Make Payment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsPaymentOpen(false);
                    setPaymentAmount("");
                    setSelectedDebt(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
