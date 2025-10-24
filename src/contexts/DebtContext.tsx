import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Debt {
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
  createdAt: string;
  lastPaymentDate?: string;
  totalPaid?: number;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  description: string;
  type: 'regular' | 'extra' | 'lump_sum';
}

export interface RepaymentPlan {
  debtId: string;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  payoffDate: string;
  strategy: 'debt_snowball' | 'debt_avalanche' | 'custom';
}

interface DebtContextType {
  debts: Debt[];
  payments: DebtPayment[];
  repaymentPlans: RepaymentPlan[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'currentAmount' | 'totalPaid'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  makePayment: (debtId: string, amount: number, description?: string, type?: 'regular' | 'extra' | 'lump_sum') => void;
  calculateRepaymentPlan: (debtId: string, monthlyPayment: number) => RepaymentPlan;
  calculateDebtSnowball: () => RepaymentPlan[];
  calculateDebtAvalanche: () => RepaymentPlan[];
  getTotalDebt: () => number;
  getTotalMonthlyPayments: () => number;
  getDebtSummary: () => {
    totalDebt: number;
    totalMonthlyPayments: number;
    averageInterestRate: number;
    totalInterest: number;
    activeDebts: number;
    paidDebts: number;
  };
}

const DebtContext = createContext<DebtContextType | undefined>(undefined);

const STORAGE_DEBTS_KEY = 'finbridge_debts';
const STORAGE_PAYMENTS_KEY = 'finbridge_debt_payments';

export const DebtProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [repaymentPlans, setRepaymentPlans] = useState<RepaymentPlan[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDebts = localStorage.getItem(STORAGE_DEBTS_KEY);
    const savedPayments = localStorage.getItem(STORAGE_PAYMENTS_KEY);
    
    if (savedDebts) {
      try {
        setDebts(JSON.parse(savedDebts));
      } catch (error) {
        console.error('Error loading debts:', error);
      }
    }
    
    if (savedPayments) {
      try {
        setPayments(JSON.parse(savedPayments));
      } catch (error) {
        console.error('Error loading payments:', error);
      }
    }
  }, []);

  // Save debts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_DEBTS_KEY, JSON.stringify(debts));
  }, [debts]);

  // Save payments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  const addDebt = (debtData: Omit<Debt, 'id' | 'createdAt' | 'currentAmount' | 'totalPaid'>) => {
    const newDebt: Debt = {
      ...debtData,
      id: `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      currentAmount: debtData.originalAmount,
      totalPaid: 0,
    };
    
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
    setPayments(prev => prev.filter(payment => payment.debtId !== id));
  };

  const makePayment = (debtId: string, amount: number, description?: string, type: 'regular' | 'extra' | 'lump_sum' = 'regular') => {
    const payment: DebtPayment = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      debtId,
      amount,
      date: new Date().toISOString(),
      description: description || `Payment of ₹${amount.toLocaleString()}`,
      type,
    };

    setPayments(prev => [...prev, payment]);

    // Update debt current amount and total paid
    setDebts(prev => prev.map(debt => {
      if (debt.id === debtId) {
        const newCurrentAmount = Math.max(0, debt.currentAmount - amount);
        const newTotalPaid = (debt.totalPaid || 0) + amount;
        const newStatus = newCurrentAmount === 0 ? 'paid' : debt.status;
        
        return {
          ...debt,
          currentAmount: newCurrentAmount,
          totalPaid: newTotalPaid,
          status: newStatus,
          lastPaymentDate: payment.date,
        };
      }
      return debt;
    }));
  };

  const calculateRepaymentPlan = (debtId: string, monthlyPayment: number): RepaymentPlan => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) {
      throw new Error('Debt not found');
    }

    const monthlyRate = debt.interestRate / 100 / 12;
    let remainingBalance = debt.currentAmount;
    let totalInterest = 0;
    let months = 0;

    while (remainingBalance > 0.01 && months < 600) { // Max 50 years
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, remainingBalance);
      
      totalInterest += interestPayment;
      remainingBalance -= principalPayment;
      months++;
    }

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    return {
      debtId,
      monthlyPayment,
      totalPayments: months,
      totalInterest,
      payoffDate: payoffDate.toISOString(),
      strategy: 'custom',
    };
  };

  const calculateDebtSnowball = (): RepaymentPlan[] => {
    // Sort debts by current amount (smallest first)
    const sortedDebts = [...debts]
      .filter(debt => debt.status === 'active')
      .sort((a, b) => a.currentAmount - b.currentAmount);

    return sortedDebts.map(debt => {
      const monthlyPayment = debt.monthlyPayment || 5000; // Default minimum payment
      return calculateRepaymentPlan(debt.id, monthlyPayment);
    });
  };

  const calculateDebtAvalanche = (): RepaymentPlan[] => {
    // Sort debts by interest rate (highest first)
    const sortedDebts = [...debts]
      .filter(debt => debt.status === 'active')
      .sort((a, b) => b.interestRate - a.interestRate);

    return sortedDebts.map(debt => {
      const monthlyPayment = debt.monthlyPayment || 5000; // Default minimum payment
      return calculateRepaymentPlan(debt.id, monthlyPayment);
    });
  };

  const getTotalDebt = (): number => {
    return debts
      .filter(debt => debt.status === 'active')
      .reduce((total, debt) => total + debt.currentAmount, 0);
  };

  const getTotalMonthlyPayments = (): number => {
    return debts
      .filter(debt => debt.status === 'active')
      .reduce((total, debt) => total + (debt.monthlyPayment || 0), 0);
  };

  const getDebtSummary = () => {
    const activeDebts = debts.filter(debt => debt.status === 'active');
    const totalDebt = getTotalDebt();
    const totalMonthlyPayments = getTotalMonthlyPayments();
    const averageInterestRate = activeDebts.length > 0 
      ? activeDebts.reduce((sum, debt) => sum + debt.interestRate, 0) / activeDebts.length 
      : 0;
    
    const totalInterest = activeDebts.reduce((sum, debt) => {
      const plan = calculateRepaymentPlan(debt.id, debt.monthlyPayment || 5000);
      return sum + plan.totalInterest;
    }, 0);

    return {
      totalDebt,
      totalMonthlyPayments,
      averageInterestRate,
      totalInterest,
      activeDebts: activeDebts.length,
      paidDebts: debts.filter(debt => debt.status === 'paid').length,
    };
  };

  const value: DebtContextType = {
    debts,
    payments,
    repaymentPlans,
    addDebt,
    updateDebt,
    deleteDebt,
    makePayment,
    calculateRepaymentPlan,
    calculateDebtSnowball,
    calculateDebtAvalanche,
    getTotalDebt,
    getTotalMonthlyPayments,
    getDebtSummary,
  };

  return (
    <DebtContext.Provider value={value}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebt = (): DebtContextType => {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error('useDebt must be used within a DebtProvider');
  }
  return context;
};
