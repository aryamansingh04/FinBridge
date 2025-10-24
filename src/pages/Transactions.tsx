import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Filter, 
  Search, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  PiggyBank,
  FileText,
  Eye,
  MoreHorizontal,
  Receipt
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
  isSignedIn: boolean;
  signInMethod: string;
}

export const Transactions = () => {
  const { t } = useTranslation();
  const { walletData } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Export states
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  
  // Transaction detail states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
    
    // Use transactions from wallet context
    setTransactions(walletData.transactions);
    setFilteredTransactions(walletData.transactions);
  }, [walletData.transactions]);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        
        switch (dateFilter) {
          case "today":
            return transactionDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          case "year":
            const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            return transactionDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'income':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'withdraw':
      case 'expense':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'transfer':
        return <ArrowUpDown className="w-4 h-4 text-blue-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'income':
        return 'text-green-600 bg-green-50';
      case 'withdraw':
      case 'expense':
        return 'text-red-600 bg-red-50';
      case 'transfer':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleExportStatement = () => {
    // Generate PDF content
    const statementData = {
      user: userProfile,
      transactions: filteredTransactions,
      period: {
        start: exportStartDate || 'All Time',
        end: exportEndDate || 'Present'
      },
      generatedAt: new Date().toISOString()
    };

    // Create PDF content (simplified version)
    const pdfContent = generatePDFContent(statementData);
    
    // Download PDF
    downloadPDF(pdfContent, `FinBridge_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
    
    setIsExportOpen(false);
  };

  const generatePDFContent = (data: any) => {
    // This is a simplified PDF generation
    // In a real app, you'd use a library like jsPDF or PDFKit
    const content = `
      FINBRIDGE BANK STATEMENT
      ========================
      
      Account Holder: ${data.user?.name || 'N/A'}
      Email: ${data.user?.email || 'N/A'}
      Period: ${data.period.start} to ${data.period.end}
      Generated: ${new Date(data.generatedAt).toLocaleString()}
      
      TRANSACTIONS:
      =============
      
      ${data.transactions.map((tx: Transaction) => `
        Date: ${formatDate(tx.date)} ${formatTime(tx.date)}
        Description: ${tx.description}
        Type: ${tx.type.toUpperCase()}
        Amount: ${formatCurrency(tx.amount)}
        Status: ${tx.status.toUpperCase()}
        ---
      `).join('\n')}
      
      Total Transactions: ${data.transactions.length}
      Statement generated by FinBridge Digital Wallet
    `;
    
    return content;
  };

  const downloadPDF = (content: string, filename: string) => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };

  // Remove the userProfile check to allow access to transactions
  // if (!userProfile) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold mb-4">{t('transactions.accessDenied')}</h2>
  //         <p className="text-muted-foreground">{t('transactions.completeProfile')}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('transactions.title')}</h1>
            <p className="text-muted-foreground">{t('transactions.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('transactions.exportStatement')}</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('transactions.exportBankStatement')}</DialogTitle>
                  <DialogDescription>
                    {t('transactions.downloadStatement')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">{t('transactions.startDate')}</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">{t('transactions.endDate')}</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="export-format">{t('transactions.format')}</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">{t('transactions.pdfStatement')}</SelectItem>
                        <SelectItem value="csv">{t('transactions.csvExport')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleExportStatement} 
                      className="flex-1 h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">{t('transactions.downloadStatement')}</span>
                      <span className="sm:hidden">Download</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsExportOpen(false)}
                      className="h-10 sm:h-auto px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      {t('transactions.cancel')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('transactions.filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">{t('transactions.search')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder={t('transactions.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type-filter">{t('transactions.type')}</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactions.allTypes')}</SelectItem>
                    <SelectItem value="deposit">{t('transactions.deposits')}</SelectItem>
                    <SelectItem value="withdraw">{t('transactions.withdrawals')}</SelectItem>
                    <SelectItem value="transfer">{t('transactions.transfers')}</SelectItem>
                    <SelectItem value="income">{t('transactions.income')}</SelectItem>
                    <SelectItem value="expense">{t('transactions.expenses')}</SelectItem>
                    <SelectItem value="loan_application">{t('transactions.loanApplications')}</SelectItem>
                    <SelectItem value="debt_payment">{t('transactions.debtPayments')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">{t('transactions.status')}</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactions.allStatus')}</SelectItem>
                    <SelectItem value="completed">{t('transactions.completed')}</SelectItem>
                    <SelectItem value="pending">{t('transactions.pending')}</SelectItem>
                    <SelectItem value="failed">{t('transactions.failed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date-filter">{t('transactions.dateRange')}</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactions.allTime')}</SelectItem>
                    <SelectItem value="today">{t('transactions.today')}</SelectItem>
                    <SelectItem value="week">{t('transactions.last7Days')}</SelectItem>
                    <SelectItem value="month">{t('transactions.last30Days')}</SelectItem>
                    <SelectItem value="year">{t('transactions.lastYear')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  {t('transactions.clearFilters')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('transactions.totalTransactions')}</p>
                  <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('transactions.totalIncome')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      filteredTransactions
                        .filter(t => t.type === 'income' || t.type === 'deposit')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <ArrowDownRight className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('transactions.totalExpenses')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(
                      filteredTransactions
                        .filter(t => t.type === 'expense' || t.type === 'withdraw')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.transactionHistory')}</CardTitle>
            <CardDescription>
              {filteredTransactions.length} {t('transactions.transactionsFound')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">{t('transactions.noTransactions')}</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" || dateFilter !== "all"
                    ? t('transactions.adjustFilters')
                    : t('transactions.transactionHistoryEmpty')
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(transaction.date)} at {formatTime(transaction.date)}</span>
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'income'
                            ? 'text-green-600'
                            : transaction.type === 'withdraw' || transaction.type === 'expense'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'income' ? '+' : 
                           transaction.type === 'withdraw' || transaction.type === 'expense' ? '-' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Transaction Detail Modal */}
      <Dialog open={isTransactionDetailOpen} onOpenChange={setIsTransactionDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Icon and Type */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedTransaction.type === 'deposit' || selectedTransaction.type === 'income'
                    ? 'bg-green-100 text-green-600'
                    : selectedTransaction.type === 'withdraw' || selectedTransaction.type === 'expense'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {selectedTransaction.type === 'deposit' || selectedTransaction.type === 'income' ? (
                    <ArrowDownRight className="w-6 h-6" />
                  ) : selectedTransaction.type === 'withdraw' || selectedTransaction.type === 'expense' ? (
                    <ArrowUpRight className="w-6 h-6" />
                  ) : (
                    <ArrowUpDown className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedTransaction.description}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedTransaction.type}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className={`text-2xl font-bold ${
                    selectedTransaction.type === 'deposit' || selectedTransaction.type === 'income'
                      ? 'text-green-600'
                      : selectedTransaction.type === 'withdraw' || selectedTransaction.type === 'expense'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}>
                    {selectedTransaction.type === 'deposit' || selectedTransaction.type === 'income' ? '+' : 
                     selectedTransaction.type === 'withdraw' || selectedTransaction.type === 'expense' ? '-' : ''}
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm font-mono">{selectedTransaction.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="text-sm">{formatDate(selectedTransaction.date)} at {formatTime(selectedTransaction.date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                
                {selectedTransaction.category && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="outline" className="capitalize">
                      {selectedTransaction.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  className="w-full max-w-xs"
                  onClick={() => setIsTransactionDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
