import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'income' | 'expense' | 'loan_application' | 'debt_payment';
  amount: number;
  description: string;
  category?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  emi?: number;
  tenure?: number;
  interestRate?: number;
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

interface WalletData {
  currentBalance: number;
  availableBalance: number;
  totalSavings: number;
  monthlyBudget: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategory[];
}

interface WalletContextType {
  walletData: WalletData;
  updateBalance: (amount: number, type: 'deposit' | 'withdraw') => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  addPendingTransaction: (transaction: Transaction) => void;
  updateSavingsGoal: (goalId: string, savedAmount: number) => void;
  updateBudgetCategory: (categoryId: string, spentAmount: number) => void;
  setMonthlyBudget: (budget: number) => void;
  approveLoan: (transactionId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const defaultWalletData: WalletData = {
  currentBalance: 25000,
  availableBalance: 25000,
  totalSavings: 15000,
  monthlyBudget: 20000,
  transactions: [
    { id: '1', type: 'deposit', amount: 5000, description: 'Salary Credit', date: '2024-01-15', status: 'completed' },
    { id: '2', type: 'withdraw', amount: 1500, description: 'ATM Withdrawal', date: '2024-01-14', status: 'completed' },
    { id: '3', type: 'transfer', amount: 2000, description: 'Transfer to Savings', date: '2024-01-13', status: 'completed' },
    { id: '4', type: 'deposit', amount: 3000, description: 'Cash Deposit', date: '2024-01-12', status: 'completed' },
    { id: '5', type: 'income', amount: 25000, description: 'Monthly Salary', category: 'income', date: '2024-01-15', status: 'completed' },
    { id: '6', type: 'expense', amount: 1200, description: 'Grocery Shopping', category: 'food', date: '2024-01-14', status: 'completed' },
    { id: '7', type: 'expense', amount: 800, description: 'Movie Tickets', category: 'entertainment', date: '2024-01-13', status: 'completed' },
    { id: '8', type: 'expense', amount: 5000, description: 'Rent Payment', category: 'necessity', date: '2024-01-12', status: 'completed' },
  ],
  savingsGoals: [
    { id: '1', name: 'Emergency Fund', targetAmount: 50000, savedAmount: 25000, monthlyContribution: 5000, deadline: '2024-12-31' },
    { id: '2', name: 'Vacation Fund', targetAmount: 30000, savedAmount: 12000, monthlyContribution: 3000, deadline: '2024-08-31' },
    { id: '3', name: 'Education Fund', targetAmount: 100000, savedAmount: 35000, monthlyContribution: 8000, deadline: '2025-06-30' },
  ],
  budgetCategories: [
    { id: '1', name: 'Food & Dining', budgetAmount: 5000, spentAmount: 3200, color: 'bg-red-500' },
    { id: '2', name: 'Transportation', budgetAmount: 3000, spentAmount: 1800, color: 'bg-blue-500' },
    { id: '3', name: 'Entertainment', budgetAmount: 2000, spentAmount: 1500, color: 'bg-green-500' },
    { id: '4', name: 'Shopping', budgetAmount: 4000, spentAmount: 2800, color: 'bg-purple-500' },
    { id: '5', name: 'Healthcare', budgetAmount: 2000, spentAmount: 800, color: 'bg-yellow-500' },
    { id: '6', name: 'Utilities', budgetAmount: 3000, spentAmount: 2200, color: 'bg-orange-500' },
  ],
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletData, setWalletData] = useState<WalletData>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('walletData');
    return saved ? JSON.parse(saved) : defaultWalletData;
  });

  // Save to localStorage whenever walletData changes
  useEffect(() => {
    localStorage.setItem('walletData', JSON.stringify(walletData));
  }, [walletData]);

  const updateBalance = (amount: number, type: 'deposit' | 'withdraw') => {
    setWalletData(prev => ({
      ...prev,
      currentBalance: type === 'deposit' 
        ? prev.currentBalance + amount 
        : prev.currentBalance - amount,
      availableBalance: type === 'deposit' 
        ? prev.availableBalance + amount 
        : prev.availableBalance - amount,
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };

    setWalletData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const addPendingTransaction = (transaction: Transaction) => {
    setWalletData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
  };

  const updateSavingsGoal = (goalId: string, savedAmount: number) => {
    setWalletData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(goal =>
        goal.id === goalId ? { ...goal, savedAmount } : goal
      ),
    }));
  };

  const updateBudgetCategory = (categoryId: string, spentAmount: number) => {
    setWalletData(prev => ({
      ...prev,
      budgetCategories: prev.budgetCategories.map(category =>
        category.id === categoryId ? { ...category, spentAmount } : category
      ),
    }));
  };

  const setMonthlyBudget = (budget: number) => {
    setWalletData(prev => ({
      ...prev,
      monthlyBudget: budget,
    }));
  };

  const approveLoan = (transactionId: string) => {
    setWalletData(prev => {
      const transaction = prev.transactions.find(t => t.id === transactionId);
      if (!transaction || transaction.type !== 'loan_application' || transaction.status !== 'pending') {
        return prev;
      }

      // Update transaction status to completed
      const updatedTransactions = prev.transactions.map(t =>
        t.id === transactionId ? { ...t, status: 'completed' as const } : t
      );

      // Add loan amount to current balance
      const newBalance = prev.currentBalance + transaction.amount;
      const newAvailableBalance = prev.availableBalance + transaction.amount;

      return {
        ...prev,
        currentBalance: newBalance,
        availableBalance: newAvailableBalance,
        transactions: updatedTransactions,
      };
    });
  };

  const value: WalletContextType = {
    walletData,
    updateBalance,
    addTransaction,
    addPendingTransaction,
    updateSavingsGoal,
    updateBudgetCategory,
    setMonthlyBudget,
    approveLoan,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
