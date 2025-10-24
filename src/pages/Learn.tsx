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
  Play,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  GraduationCap,
  DollarSign,
  PiggyBank,
  CreditCard,
  Home,
  Briefcase,
  Shield,
  Smartphone,
  BarChart3,
  Calculator,
  FileText,
  Video,
  Youtube
} from "lucide-react";

interface VideoContent {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  views: string;
  rating: number;
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  publishedDate: string;
}

export const Learn = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = [
    { id: "all", name: t('learn.allTopics'), icon: <BookOpen className="w-4 h-4" /> },
    { id: "Personal Finance", name: t('learn.categories.personalFinance'), icon: <DollarSign className="w-4 h-4" /> },
    { id: "Investment", name: t('learn.categories.investment'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: "Banking", name: t('learn.categories.banking'), icon: <CreditCard className="w-4 h-4" /> },
    { id: "Loans", name: t('learn.categories.loans'), icon: <Home className="w-4 h-4" /> },
    { id: "Insurance", name: t('learn.categories.insurance'), icon: <Shield className="w-4 h-4" /> },
    { id: "Digital Banking", name: t('learn.categories.digitalBanking'), icon: <Smartphone className="w-4 h-4" /> },
    { id: "Budgeting", name: t('learn.categories.budgeting'), icon: <Calculator className="w-4 h-4" /> },
    { id: "Savings", name: t('learn.categories.savings'), icon: <PiggyBank className="w-4 h-4" /> },
    { id: "Entrepreneurship", name: t('learn.categories.entrepreneurship'), icon: <Briefcase className="w-4 h-4" /> }
  ];

  const levels = [
    { id: "all", name: t('learn.allLevels'), color: "bg-gray-100" },
    { id: "beginner", name: t('learn.beginner'), color: "bg-green-100" },
    { id: "intermediate", name: t('learn.intermediate'), color: "bg-yellow-100" },
    { id: "advanced", name: t('learn.advanced'), color: "bg-red-100" }
  ];

  const videoContent: VideoContent[] = [
    {
      id: "personal-finance-basics",
      title: "Personal Finance Basics: A Complete Guide for Beginners",
      description: "Learn the fundamentals of personal finance including budgeting, saving, and managing money effectively.",
      category: "Personal Finance",
      duration: "15:30",
      views: "2.5M",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Financial Education Hub",
      level: "beginner",
      tags: ["budgeting", "saving", "money management"],
      publishedDate: "2024-01-15"
    },
    {
      id: "investment-strategies",
      title: "Investment Strategies for Long-term Wealth Building",
      description: "Discover proven investment strategies to build wealth over time with stocks, bonds, and mutual funds.",
      category: "Investment",
      duration: "22:45",
      views: "1.8M",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Investment Mastery",
      level: "intermediate",
      tags: ["stocks", "bonds", "mutual funds", "wealth building"],
      publishedDate: "2024-01-10"
    },
    {
      id: "digital-banking-guide",
      title: "Complete Guide to Digital Banking and Mobile Payments",
      description: "Master digital banking, mobile payments, and online financial management tools.",
      category: "Digital Banking",
      duration: "18:20",
      views: "1.2M",
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Tech Finance",
      level: "beginner",
      tags: ["digital banking", "mobile payments", "online banking"],
      publishedDate: "2024-01-08"
    },
    {
      id: "loan-application-process",
      title: "How to Apply for Loans: Step-by-Step Process",
      description: "Learn the complete loan application process, documentation requirements, and tips for approval.",
      category: "Loans",
      duration: "25:15",
      views: "950K",
      rating: 4.6,
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Loan Experts",
      level: "intermediate",
      tags: ["loan application", "documentation", "approval tips"],
      publishedDate: "2024-01-05"
    },
    {
      id: "insurance-fundamentals",
      title: "Insurance Fundamentals: Protecting Your Financial Future",
      description: "Understand different types of insurance and how to choose the right coverage for your needs.",
      category: "Insurance",
      duration: "20:30",
      views: "1.1M",
      rating: 4.5,
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Insurance Insights",
      level: "beginner",
      tags: ["life insurance", "health insurance", "coverage"],
      publishedDate: "2024-01-03"
    },
    {
      id: "budgeting-masterclass",
      title: "Budgeting Masterclass: Take Control of Your Finances",
      description: "Advanced budgeting techniques and tools to manage your money like a pro.",
      category: "Budgeting",
      duration: "28:45",
      views: "1.5M",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Budget Masters",
      level: "intermediate",
      tags: ["budgeting", "expense tracking", "financial planning"],
      publishedDate: "2024-01-01"
    },
    {
      id: "savings-strategies",
      title: "Smart Savings Strategies: Build Your Emergency Fund",
      description: "Learn effective savings strategies and how to build a robust emergency fund.",
      category: "Savings",
      duration: "16:20",
      views: "1.3M",
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Savings Success",
      level: "beginner",
      tags: ["emergency fund", "savings goals", "financial security"],
      publishedDate: "2023-12-28"
    },
    {
      id: "entrepreneurship-finance",
      title: "Entrepreneurship and Finance: Funding Your Business",
      description: "Essential financial knowledge for entrepreneurs and small business owners.",
      category: "Entrepreneurship",
      duration: "32:10",
      views: "800K",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Business Finance Pro",
      level: "advanced",
      tags: ["business funding", "startup finance", "entrepreneurship"],
      publishedDate: "2023-12-25"
    },
    {
      id: "credit-score-improvement",
      title: "How to Improve Your Credit Score: Expert Tips",
      description: "Proven strategies to boost your credit score and maintain excellent credit health.",
      category: "Banking",
      duration: "19:35",
      views: "1.6M",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Credit Experts",
      level: "intermediate",
      tags: ["credit score", "credit repair", "financial health"],
      publishedDate: "2023-12-22"
    },
    {
      id: "retirement-planning",
      title: "Retirement Planning: Secure Your Financial Future",
      description: "Comprehensive guide to retirement planning and building a secure financial future.",
      category: "Investment",
      duration: "26:50",
      views: "1.4M",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Retirement Ready",
      level: "advanced",
      tags: ["retirement", "pension", "financial planning"],
      publishedDate: "2023-12-20"
    },
    {
      id: "cryptocurrency-basics",
      title: "Cryptocurrency Basics: Understanding Digital Assets",
      description: "Introduction to cryptocurrency, blockchain technology, and digital asset investment.",
      category: "Investment",
      duration: "24:15",
      views: "2.1M",
      rating: 4.6,
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Crypto Finance",
      level: "intermediate",
      tags: ["cryptocurrency", "blockchain", "digital assets"],
      publishedDate: "2023-12-18"
    },
    {
      id: "tax-planning-guide",
      title: "Tax Planning Guide: Maximize Your Savings",
      description: "Essential tax planning strategies to minimize your tax burden and maximize savings.",
      category: "Personal Finance",
      duration: "21:40",
      views: "1.7M",
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channel: "Tax Savers",
      level: "intermediate",
      tags: ["tax planning", "tax savings", "financial planning"],
      publishedDate: "2023-12-15"
    }
  ];

  const filteredVideos = videoContent.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || video.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatViews = (views: string) => {
    return views;
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{t('learn.title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{t('learn.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Video className="w-3 h-3 mr-1" />
              {filteredVideos.length} Videos
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Youtube className="w-3 h-3 mr-1" />
              YouTube
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder={t('learn.searchPlaceholder')}
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
                    {categories.find(c => c.id === selectedCategory)?.name || t('learn.allTopics')}
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
          
          {/* Level Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 sm:h-12 px-3 sm:px-4 border-2 hover:border-blue-500 transition-colors w-full lg:w-auto"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    selectedLevel === "all" ? "bg-gray-400" : 
                    selectedLevel === "beginner" ? "bg-green-500" :
                    selectedLevel === "intermediate" ? "bg-yellow-500" :
                    selectedLevel === "advanced" ? "bg-red-500" : "bg-gray-400"
                  }`} />
                  <span className="font-medium text-sm sm:text-base truncate">
                    {levels.find(l => l.id === selectedLevel)?.name || t('learn.allLevels')}
                  </span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full lg:w-48">
              {levels.map((level) => (
                <DropdownMenuItem
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    selectedLevel === level.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${
                    selectedLevel === level.id ? "bg-blue-500" : 
                    level.id === "beginner" ? "bg-green-500" :
                    level.id === "intermediate" ? "bg-yellow-500" :
                    level.id === "advanced" ? "bg-red-500" : "bg-gray-400"
                  }`} />
                  <span className="font-medium">{level.name}</span>
                  {selectedLevel === level.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 sm:p-4">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <Badge className={`text-xs font-medium px-2 py-1 ${getLevelColor(video.level)}`}>
                    {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>
              
              <CardHeader className="pb-2 sm:pb-3 flex-shrink-0">
                <CardTitle className="text-sm sm:text-base lg:text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  {video.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{formatViews(video.views)} {t('learn.views')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs truncate max-w-[120px]">
                      {video.category}
                    </Badge>
                    <span className="text-xs text-gray-500 truncate max-w-[100px]">{video.channel}</span>
                  </div>
                </div>
                
                <Button 
                  asChild
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  <a 
                    href={video.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('learn.watchOnYouTube')}</span>
                    <span className="sm:hidden">Watch</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Video className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">{t('learn.noVideosFound')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              {t('learn.noVideosDescription')}
            </p>
          </div>
        )}

        {/* Learning Statistics */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-gray-800">{t('learn.statistics.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{videoContent.length}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('learn.statistics.totalVideos')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {videoContent.filter(v => v.level === 'beginner').length}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('learn.statistics.beginnerVideos')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('learn.statistics.topicsCovered')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {Math.round(videoContent.reduce((acc, video) => acc + video.rating, 0) / videoContent.length * 10) / 10}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('learn.statistics.averageRating')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
