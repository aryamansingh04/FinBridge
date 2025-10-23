import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search,
  ChevronDown,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Globe,
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  CreditCard,
  PiggyBank,
  Briefcase,
  Shield,
  Smartphone,
  BarChart3,
  Newspaper,
  Eye,
  ChevronRight,
  ChevronLeft,
  Filter,
  Bookmark,
  Share2
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'local' | 'national' | 'international';
  type: 'market' | 'banking' | 'investment' | 'policy' | 'technology' | 'crypto' | 'economy';
  author: string;
  source: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isBreaking: boolean;
  isTrending: boolean;
  views: number;
  likes: number;
}

export const News = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories = [
    { id: "all", name: t('news.allNews'), icon: <Newspaper className="w-4 h-4" /> },
    { id: "local", name: t('news.local'), icon: <MapPin className="w-4 h-4" /> },
    { id: "national", name: t('news.national'), icon: <Globe className="w-4 h-4" /> },
    { id: "international", name: t('news.international'), icon: <Globe className="w-4 h-4" /> }
  ];

  const types = [
    { id: "all", name: t('news.allTypes'), icon: <Newspaper className="w-4 h-4" /> },
    { id: "market", name: t('news.market'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: "banking", name: t('news.banking'), icon: <Building2 className="w-4 h-4" /> },
    { id: "investment", name: t('news.investment'), icon: <Briefcase className="w-4 h-4" /> },
    { id: "policy", name: t('news.policy'), icon: <Shield className="w-4 h-4" /> },
    { id: "technology", name: t('news.technology'), icon: <Smartphone className="w-4 h-4" /> },
    { id: "crypto", name: t('news.crypto'), icon: <DollarSign className="w-4 h-4" /> },
    { id: "economy", name: t('news.economy'), icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: "rbi-rate-cut-2024",
      title: "RBI Cuts Repo Rate by 25 Basis Points to Boost Economic Growth",
      summary: "The Reserve Bank of India has announced a 25 basis point cut in the repo rate, bringing it down to 6.25% to stimulate economic growth and support businesses.",
      content: "The Reserve Bank of India (RBI) has announced a significant monetary policy decision, cutting the repo rate by 25 basis points from 6.50% to 6.25%. This move comes as part of the central bank's efforts to boost economic growth and support businesses amid global economic uncertainties.\n\nGovernor Shaktikanta Das stated that the decision was taken after careful consideration of various economic indicators, including inflation trends, GDP growth projections, and global economic conditions. The rate cut is expected to reduce borrowing costs for businesses and consumers, potentially stimulating investment and consumption.\n\nThe RBI also maintained its accommodative stance, signaling that further rate cuts may be considered if economic conditions warrant. This decision is expected to have positive implications for the housing sector, automobile industry, and small and medium enterprises (SMEs).\n\nMarket analysts have welcomed the move, with the Sensex and Nifty showing positive momentum following the announcement. The banking sector is expected to benefit from increased lending activity, while consumers may see reduced EMIs on their loans.",
      category: "national",
      type: "policy",
      author: "Rajesh Kumar",
      source: "Financial Times India",
      publishedDate: "2024-01-15",
      readTime: "4 min",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      tags: ["RBI", "Interest Rates", "Monetary Policy", "Economic Growth"],
      isBreaking: true,
      isTrending: true,
      views: 15420,
      likes: 892
    },
    {
      id: "bitcoin-surge-2024",
      title: "Bitcoin Reaches New All-Time High Above $100,000",
      summary: "Bitcoin has surged past $100,000 for the first time, driven by institutional adoption and positive regulatory developments worldwide.",
      content: "Bitcoin has achieved a historic milestone, breaking through the $100,000 barrier for the first time in its history. This remarkable surge represents a 150% increase from the beginning of 2024 and has been driven by several key factors.\n\nMajor institutional investors, including pension funds and insurance companies, have significantly increased their Bitcoin allocations. Additionally, regulatory clarity in major markets like the United States and European Union has provided confidence to both institutional and retail investors.\n\nThe approval of Bitcoin ETFs by major financial regulators has also played a crucial role in this surge. These investment vehicles have made it easier for traditional investors to gain exposure to Bitcoin without directly holding the cryptocurrency.\n\nMarket analysts predict that this upward trend may continue, with some forecasting Bitcoin could reach $150,000 by the end of 2024. However, they also caution investors about the inherent volatility of cryptocurrency markets and recommend careful risk management.",
      category: "international",
      type: "crypto",
      author: "Sarah Johnson",
      source: "Crypto News Global",
      publishedDate: "2024-01-14",
      readTime: "3 min",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      tags: ["Bitcoin", "Cryptocurrency", "Digital Assets", "Investment"],
      isBreaking: true,
      isTrending: true,
      views: 28750,
      likes: 2156
    },
    {
      id: "fintech-startup-funding",
      title: "Local Fintech Startup Raises $50M in Series B Funding",
      summary: "Mumbai-based fintech startup PayEasy has secured $50 million in Series B funding to expand its digital payment solutions across India.",
      content: "PayEasy, a Mumbai-based fintech startup, has successfully raised $50 million in its Series B funding round, led by prominent venture capital firms including Sequoia Capital India and Accel Partners. This funding will be used to expand the company's digital payment solutions across India and enhance its technology infrastructure.\n\nThe startup, founded in 2022, has already processed over $1 billion in transactions and serves more than 2 million users across 15 states. The company's innovative approach to digital payments, particularly in rural and semi-urban areas, has attracted significant investor interest.\n\nCEO Priya Sharma stated that the funding will enable PayEasy to launch new products, including micro-lending services and insurance products, while also expanding its merchant network. The company plans to hire 200 additional employees over the next 12 months.\n\nThis funding round values PayEasy at $300 million, making it one of the most valuable fintech startups in India. The investment reflects growing confidence in India's digital payment ecosystem and the potential for financial inclusion through technology.",
      category: "local",
      type: "technology",
      author: "Amit Patel",
      source: "TechCrunch India",
      publishedDate: "2024-01-13",
      readTime: "5 min",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      tags: ["Fintech", "Startup", "Funding", "Digital Payments"],
      isBreaking: false,
      isTrending: true,
      views: 12340,
      likes: 567
    },
    {
      id: "stock-market-rally",
      title: "Indian Stock Markets Rally on Strong Q4 Earnings",
      summary: "Sensex and Nifty have surged 3% following better-than-expected quarterly earnings from major companies across sectors.",
      content: "Indian stock markets have witnessed a strong rally, with the Sensex gaining over 1,200 points and the Nifty crossing the 24,000 mark for the first time. This surge has been driven by better-than-expected quarterly earnings from major companies across various sectors.\n\nLeading the rally are banking stocks, with HDFC Bank, ICICI Bank, and State Bank of India reporting robust quarterly results. The IT sector has also shown strong performance, with TCS, Infosys, and Wipro exceeding analyst expectations.\n\nForeign institutional investors (FIIs) have turned net buyers, investing over $2 billion in Indian equities this month. This marks a significant shift from the previous months when FIIs were net sellers due to global economic uncertainties.\n\nMarket analysts attribute this rally to several factors, including strong domestic demand, government infrastructure spending, and positive global cues. The Reserve Bank of India's recent rate cut has also provided additional momentum to the markets.\n\nHowever, experts caution investors to remain vigilant about global economic developments and maintain a diversified portfolio approach.",
      category: "national",
      type: "market",
      author: "Vikram Singh",
      source: "Economic Times",
      publishedDate: "2024-01-12",
      readTime: "4 min",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      tags: ["Stock Market", "Sensex", "Nifty", "Earnings"],
      isBreaking: false,
      isTrending: true,
      views: 18920,
      likes: 1023
    },
    {
      id: "green-bonds-issuance",
      title: "Government Issues $2 Billion Green Bonds for Climate Projects",
      summary: "India has successfully issued $2 billion in green bonds to fund renewable energy and climate adaptation projects across the country.",
      content: "The Government of India has successfully issued $2 billion in green bonds, marking a significant milestone in the country's commitment to sustainable development and climate action. These bonds will be used to fund renewable energy projects, climate adaptation initiatives, and environmental conservation programs.\n\nThe bond issuance was oversubscribed by 2.5 times, with strong demand from international investors, including sovereign wealth funds, pension funds, and ESG-focused investment managers. This demonstrates global confidence in India's green transition and sustainable development goals.\n\nThe proceeds from these bonds will be allocated to various projects, including solar and wind energy installations, electric vehicle infrastructure, water conservation projects, and forest restoration initiatives. The government has committed to transparent reporting on the use of these funds.\n\nThis issuance is part of India's broader strategy to achieve net-zero emissions by 2070 and increase the share of renewable energy in its total energy mix to 50% by 2030. The success of this bond issuance is expected to encourage more green financing initiatives in the country.",
      category: "national",
      type: "policy",
      author: "Deepika Sharma",
      source: "Business Standard",
      publishedDate: "2024-01-11",
      readTime: "6 min",
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de446cf2d0a9?w=800&h=400&fit=crop",
      tags: ["Green Bonds", "Climate Finance", "Sustainability", "Renewable Energy"],
      isBreaking: false,
      isTrending: false,
      views: 8750,
      likes: 445
    },
    {
      id: "ai-banking-transformation",
      title: "Major Banks Adopt AI for Customer Service and Risk Management",
      summary: "Leading Indian banks are implementing artificial intelligence solutions to enhance customer experience and improve risk assessment capabilities.",
      content: "Several major Indian banks, including SBI, HDFC Bank, and ICICI Bank, have announced significant investments in artificial intelligence (AI) technologies to transform their operations and improve customer service. These initiatives are expected to revolutionize the banking sector in India.\n\nHDFC Bank has deployed AI-powered chatbots that can handle over 80% of customer queries without human intervention. The bank has also implemented AI-driven fraud detection systems that have reduced false positives by 60% while improving detection accuracy.\n\nICICI Bank has launched an AI-based credit assessment system that can evaluate loan applications in real-time, reducing processing time from days to minutes. This system analyzes various data points, including transaction history, social media activity, and alternative credit data.\n\nState Bank of India has implemented AI solutions for personalized financial advice, helping customers make informed investment decisions based on their financial goals and risk appetite. The bank has also deployed AI for predictive analytics to identify potential loan defaults.\n\nThese AI implementations are expected to improve operational efficiency, reduce costs, and enhance customer satisfaction. However, banks are also focusing on data privacy and security to ensure customer trust in these new technologies.",
      category: "national",
      type: "technology",
      author: "Rahul Mehta",
      source: "Mint",
      publishedDate: "2024-01-10",
      readTime: "5 min",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      tags: ["AI", "Banking", "Technology", "Customer Service"],
      isBreaking: false,
      isTrending: true,
      views: 15680,
      likes: 789
    },
    {
      id: "global-inflation-trends",
      title: "Global Inflation Shows Signs of Cooling as Central Banks Maintain Hawkish Stance",
      summary: "Inflation rates across major economies are showing signs of moderation, though central banks remain cautious about premature policy easing.",
      content: "Global inflation trends are showing encouraging signs of moderation across major economies, with the United States, European Union, and other developed nations reporting lower inflation rates compared to previous months. However, central banks worldwide are maintaining a cautious approach, emphasizing the need for sustained price stability.\n\nThe Federal Reserve has indicated that while inflation is moving in the right direction, it remains above the 2% target. The European Central Bank has also maintained its hawkish stance, with President Christine Lagarde emphasizing the importance of data-dependent policy decisions.\n\nIn emerging markets, inflation dynamics vary significantly. While some countries like Brazil and Mexico have seen inflation cool down, others continue to face persistent price pressures. India's inflation has remained within the RBI's target range, providing room for monetary policy flexibility.\n\nCommodity prices, particularly energy and food prices, have shown mixed trends. While oil prices have stabilized, food prices remain volatile due to climate-related disruptions and geopolitical tensions. This uncertainty continues to influence central bank policy decisions globally.\n\nMarket participants are closely watching for signals about the timing of potential rate cuts, with most expecting a gradual easing cycle to begin in the second half of 2024, provided inflation continues to trend downward.",
      category: "international",
      type: "economy",
      author: "Michael Chen",
      source: "Financial Times",
      publishedDate: "2024-01-09",
      readTime: "7 min",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      tags: ["Inflation", "Central Banks", "Monetary Policy", "Global Economy"],
      isBreaking: false,
      isTrending: false,
      views: 22340,
      likes: 1234
    },
    {
      id: "microfinance-growth",
      title: "Microfinance Sector Sees 25% Growth in Rural India",
      summary: "Microfinance institutions have reported strong growth in rural areas, supporting financial inclusion and women entrepreneurship.",
      content: "The microfinance sector in India has witnessed remarkable growth of 25% in the past year, with significant expansion in rural and semi-urban areas. This growth has been driven by increased demand for small loans, particularly among women entrepreneurs and self-help groups.\n\nLeading microfinance institutions (MFIs) like SKS Microfinance, Bandhan Bank, and Ujjivan Small Finance Bank have reported strong portfolio growth and improved asset quality. The sector has disbursed over ₹2.5 lakh crore in loans during the current financial year.\n\nThe growth has been particularly strong in states like Bihar, Uttar Pradesh, and West Bengal, where financial inclusion initiatives have gained momentum. Women borrowers account for over 85% of the total loan portfolio, reflecting the sector's focus on women empowerment.\n\nDigital transformation has played a crucial role in this growth, with MFIs adopting mobile banking, digital payments, and online loan processing. This has reduced operational costs and improved efficiency, enabling MFIs to serve more customers in remote areas.\n\nThe Reserve Bank of India has also introduced several regulatory measures to support the sector, including relaxed norms for priority sector lending and simplified licensing procedures for small finance banks. These measures have encouraged more players to enter the microfinance space.",
      category: "local",
      type: "banking",
      author: "Sunita Reddy",
      source: "The Hindu BusinessLine",
      publishedDate: "2024-01-08",
      readTime: "4 min",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      tags: ["Microfinance", "Financial Inclusion", "Rural Development", "Women Empowerment"],
      isBreaking: false,
      isTrending: false,
      views: 9870,
      likes: 456
    }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesType = selectedType === "all" || article.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'local': return 'bg-green-100 text-green-800';
      case 'national': return 'bg-blue-100 text-blue-800';
      case 'international': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'market': return 'bg-orange-100 text-orange-800';
      case 'banking': return 'bg-indigo-100 text-indigo-800';
      case 'investment': return 'bg-emerald-100 text-emerald-800';
      case 'policy': return 'bg-red-100 text-red-800';
      case 'technology': return 'bg-cyan-100 text-cyan-800';
      case 'crypto': return 'bg-yellow-100 text-yellow-800';
      case 'economy': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{t('news.title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{t('news.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Newspaper className="w-3 h-3 mr-1" />
              {filteredArticles.length} Articles
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Updates
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder={t('news.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 sm:h-12 px-3 sm:px-4 border-2 hover:border-blue-500 transition-colors w-full lg:w-auto"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0">
                    {categories.find(c => c.id === selectedCategory)?.icon}
                  </div>
                  <span className="font-medium text-sm sm:text-base truncate">
                    {categories.find(c => c.id === selectedCategory)?.name || t('news.allNews')}
                  </span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full lg:w-56">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    selectedCategory === category.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <div className={selectedCategory === category.id ? "text-blue-600" : "text-gray-600"}>
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                  {selectedCategory === category.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 sm:h-12 px-3 sm:px-4 border-2 hover:border-blue-500 transition-colors w-full lg:w-auto"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0">
                    {types.find(t => t.id === selectedType)?.icon}
                  </div>
                  <span className="font-medium text-sm sm:text-base truncate">
                    {types.find(t => t.id === selectedType)?.name || t('news.allTypes')}
                  </span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full lg:w-48">
              {types.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    selectedType === type.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <div className={selectedType === type.id ? "text-blue-600" : "text-gray-600"}>
                    {type.icon}
                  </div>
                  <span className="font-medium">{type.name}</span>
                  {selectedType === type.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Breaking News Banner */}
        {filteredArticles.some(article => article.isBreaking) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-red-800">BREAKING NEWS</span>
            </div>
            <div className="text-sm text-red-700">
              {filteredArticles.filter(article => article.isBreaking).map(article => article.title).join(" • ")}
            </div>
          </div>
        )}

        {/* News Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
              <div className="relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {article.isBreaking && (
                    <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-1">
                      BREAKING
                    </Badge>
                  )}
                  {article.isTrending && (
                    <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                      TRENDING
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs font-medium px-2 py-1 ${getCategoryColor(article.category)}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2 sm:pb-3 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs font-medium px-2 py-1 ${getTypeColor(article.type)}`}>
                    {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                  </Badge>
                  <span className="text-xs text-gray-500">{formatDate(article.publishedDate)}</span>
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  {article.summary}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatViews(article.views)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{article.source}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                    className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                  >
                    {expandedArticle === article.id ? (
                      <>
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {t('news.readLess')}
                      </>
                    ) : (
                      <>
                        {t('news.readMore')}
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 sm:h-12 w-10 sm:w-12">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 sm:h-12 w-10 sm:w-12">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>

              {/* Expanded Article Content */}
              {expandedArticle === article.id && (
                <div className="border-t bg-gray-50 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      {article.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatViews(article.views)} views</span>
                        <span>{article.likes} likes</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          {t('news.readFullArticle')}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">{t('news.noArticlesFound')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              {t('news.noArticlesDescription')}
            </p>
          </div>
        )}

        {/* News Statistics */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-gray-800">{t('news.statistics.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{newsArticles.length}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('news.statistics.totalArticles')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {newsArticles.filter(a => a.isBreaking).length}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('news.statistics.breakingNews')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {types.length - 1}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('news.statistics.categories')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {Math.round(newsArticles.reduce((acc, article) => acc + article.views, 0) / newsArticles.length / 1000)}K
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('news.statistics.averageViews')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
