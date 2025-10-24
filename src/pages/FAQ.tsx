import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Wallet,
  CreditCard,
  Shield,
  Download,
  MessageCircle,
  Settings,
  PiggyBank,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
  tags: string[];
}

export const FAQ = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How do I set up my digital wallet?",
      answer: "To set up your digital wallet, go to the Digital Wallet section and follow the setup wizard. You'll need to create a secure passcode, verify your identity, and link your bank account. The process takes about 5-10 minutes.",
      category: "wallet",
      icon: <Wallet className="w-5 h-5" />,
      tags: ["setup", "wallet", "beginner"]
    },
    {
      id: "2",
      question: "Is my digital wallet secure?",
      answer: "Yes, your digital wallet is protected by multiple security layers including 256-bit encryption, biometric authentication, and secure passcode protection. We also use bank-level security protocols to keep your funds safe.",
      category: "security",
      icon: <Shield className="w-5 h-5" />,
      tags: ["security", "encryption", "protection"]
    },
    {
      id: "3",
      question: "How do I add money to my wallet?",
      answer: "You can add money to your wallet by clicking the 'Add Funds' button in the Digital Wallet section. You can transfer from your linked bank account, use UPI, or add cash at partner locations. Minimum deposit is ₹1.",
      category: "wallet",
      icon: <PiggyBank className="w-5 h-5" />,
      tags: ["deposit", "add money", "funding"]
    },
    {
      id: "4",
      question: "What are the withdrawal limits?",
      answer: "Daily withdrawal limit is ₹50,000 and monthly limit is ₹2,00,000. You can withdraw to your linked bank account instantly or use UPI. There's no minimum withdrawal amount.",
      category: "wallet",
      icon: <TrendingUp className="w-5 h-5" />,
      tags: ["withdrawal", "limits", "bank transfer"]
    },
    {
      id: "5",
      question: "How do I change my wallet PIN?",
      answer: "Go to the Security section in your Digital Wallet and click 'Change PIN'. Enter your current PIN, then your new PIN twice to confirm. Your new PIN must be at least 4 digits long.",
      category: "security",
      icon: <Settings className="w-5 h-5" />,
      tags: ["PIN", "security", "password"]
    },
    {
      id: "6",
      question: "Can I use biometric authentication?",
      answer: "Yes, you can enable biometric authentication (fingerprint or face ID) for quick and secure access to your wallet. Go to Security settings and toggle 'Enable Biometric' to activate this feature.",
      category: "security",
      icon: <Shield className="w-5 h-5" />,
      tags: ["biometric", "fingerprint", "face ID"]
    },
    {
      id: "7",
      question: "How do I export my transaction statement?",
      answer: "In the Security section, click 'Export Statement'. You can choose the date range and format (PDF or CSV). The statement will be downloaded to your device with all your transaction details.",
      category: "transactions",
      icon: <Download className="w-5 h-5" />,
      tags: ["export", "statement", "transactions"]
    },
    {
      id: "8",
      question: "What if I forget my wallet passcode?",
      answer: "If you forget your passcode, you can reset it by verifying your identity through your registered mobile number and email. Contact our support team for assistance with the reset process.",
      category: "security",
      icon: <AlertCircle className="w-5 h-5" />,
      tags: ["forgot passcode", "reset", "recovery"]
    },
    {
      id: "9",
      question: "How do I set up savings goals?",
      answer: "In the Digital Wallet, go to Savings Management and click 'Create Goal'. Set your target amount, monthly contribution, and deadline. You can track your progress and make additional contributions anytime.",
      category: "savings",
      icon: <PiggyBank className="w-5 h-5" />,
      tags: ["savings", "goals", "budgeting"]
    },
    {
      id: "10",
      question: "How do I manage my budget?",
      answer: "Use the Budget Tracker in your Digital Wallet to set spending limits for different categories like food, transportation, and entertainment. The system will track your spending and alert you when you're approaching limits.",
      category: "budgeting",
      icon: <TrendingUp className="w-5 h-5" />,
      tags: ["budget", "spending", "categories"]
    },
    {
      id: "11",
      question: "What payment methods are accepted?",
      answer: "We accept UPI, net banking, credit/debit cards, and digital wallets. You can also add cash at partner locations. All transactions are processed securely through our banking partners.",
      category: "payments",
      icon: <CreditCard className="w-5 h-5" />,
      tags: ["payment methods", "UPI", "cards"]
    },
    {
      id: "12",
      question: "How do I contact customer support?",
      answer: "You can contact our support team through the Help & Support section in your wallet, email us at support@finbridge.com, or call our 24/7 helpline at +91-800-123-4567. We typically respond within 2 hours.",
      category: "support",
      icon: <MessageCircle className="w-5 h-5" />,
      tags: ["support", "contact", "help"]
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "wallet", name: "Digital Wallet", icon: <Wallet className="w-4 h-4" /> },
    { id: "security", name: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "transactions", name: "Transactions", icon: <CreditCard className="w-4 h-4" /> },
    { id: "savings", name: "Savings", icon: <PiggyBank className="w-4 h-4" /> },
    { id: "budgeting", name: "Budgeting", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "payments", name: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { id: "support", name: "Support", icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions about FinBridge Digital Wallet
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search questions, answers, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  Collapse All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="transition-all duration-200 hover:shadow-md">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {faq.icon}
                        </div>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(cat => cat.id === faq.category)?.name}
                        </Badge>
                        {expandedItems.has(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedItems.has(faq.id) && (
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or category filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Support */}
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="h-10 sm:h-auto px-6 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/learn')}
                  className="h-10 sm:h-auto px-6 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  View Tutorials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
