import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  Building2, 
  Users, 
  GraduationCap, 
  Heart, 
  Home, 
  Briefcase, 
  Car, 
  Smartphone, 
  Search,
  Filter,
  ArrowRight,
  Star,
  Calendar,
  DollarSign,
  Target,
  Award,
  Shield,
  TrendingUp,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  ExternalLink,
  BookOpen,
  Lightbulb,
  HandHeart,
  ChevronDown
} from "lucide-react";

interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  shortDescription: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationProcess: string[];
  benefitsAmount: string;
  ageLimit: string;
  incomeLimit: string;
  lastDate: string;
  status: 'active' | 'upcoming' | 'closed';
  priority: 'high' | 'medium' | 'low';
  color: string;
  bgColor: string;
  website: string;
  helpline: string;
  launchedBy: string;
  launchDate: string;
  targetBeneficiaries: string;
  budgetAllocated: string;
  successStories: number;
  rating: number;
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
}

export const Schemes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [hoveredScheme, setHoveredScheme] = useState<string | null>(null);

  const governmentSchemes: GovernmentScheme[] = [
    {
      id: "pradhan-mantri-jan-dhan-yojana",
      name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      category: "Banking",
      icon: <Building2 className="w-8 h-8" />,
      description: "A national mission for financial inclusion to ensure access to financial services, namely, banking savings & deposit accounts, remittance, credit, insurance, pension in an affordable manner.",
      shortDescription: "Financial inclusion scheme providing basic banking services to all households.",
      eligibility: [
        "Any Indian citizen above 10 years of age",
        "No income criteria",
        "Valid identity proof required",
        "Address proof required"
      ],
      benefits: [
        "Zero balance savings account",
        "RuPay debit card with accident insurance of ₹2 lakh",
        "Overdraft facility up to ₹10,000",
        "Direct benefit transfer",
        "Pension and insurance schemes"
      ],
      documents: [
        "Aadhaar Card",
        "Voter ID or Driving License",
        "PAN Card (if available)",
        "Address proof",
        "Passport size photograph"
      ],
      applicationProcess: [
        "Visit any bank branch or Business Correspondent",
        "Fill the account opening form",
        "Submit required documents",
        "Account opened instantly",
        "Receive RuPay debit card within 7 days"
      ],
      benefitsAmount: "₹2,00,000 (Accident Insurance)",
      ageLimit: "10+ years",
      incomeLimit: "No income criteria",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'high',
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      website: "https://pmjdy.gov.in",
      helpline: "1800-180-1111",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "August 28, 2014",
      targetBeneficiaries: "All unbanked households",
      budgetAllocated: "₹1,000 crores",
      successStories: 450000000,
      rating: 4.8
    },
    {
      id: "pradhan-mantri-mudra-yojana",
      name: "Pradhan Mantri Mudra Yojana (PMMY)",
      category: "Entrepreneurship",
      icon: <Briefcase className="w-8 h-8" />,
      description: "A scheme to provide loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises for income generating activities.",
      shortDescription: "Micro finance scheme for small business loans up to ₹10 lakh.",
      eligibility: [
        "Indian citizens above 18 years",
        "Non-corporate, non-farm small/micro enterprises",
        "Income generating activities",
        "No collateral required for loans up to ₹50,000"
      ],
      benefits: [
        "Loans up to ₹10 lakh",
        "Three categories: Shishu (up to ₹50,000), Kishor (₹50,001-5 lakh), Tarun (₹5,00,001-10 lakh)",
        "No collateral for Shishu loans",
        "Competitive interest rates",
        "Quick processing"
      ],
      documents: [
        "Identity proof (Aadhaar/PAN/Voter ID)",
        "Address proof",
        "Business plan or project report",
        "Income proof",
        "Bank statements (if applicable)"
      ],
      applicationProcess: [
        "Visit any bank or NBFC",
        "Fill loan application form",
        "Submit business plan and documents",
        "Verification and appraisal",
        "Loan sanction and disbursement"
      ],
      benefitsAmount: "Up to ₹10,00,000",
      ageLimit: "18+ years",
      incomeLimit: "No specific limit",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'high',
      color: "text-green-600",
      bgColor: "bg-green-50",
      website: "https://mudra.org.in",
      helpline: "1800-180-1111",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "April 8, 2015",
      targetBeneficiaries: "Small and micro enterprises",
      budgetAllocated: "₹3,00,000 crores",
      successStories: 35000000,
      rating: 4.6
    },
    {
      id: "pradhan-mantri-awas-yojana",
      name: "Pradhan Mantri Awas Yojana (PMAY)",
      category: "Housing",
      icon: <Home className="w-8 h-8" />,
      description: "A flagship mission to provide affordable housing to the urban poor by 2022. The scheme aims to provide pucca houses to all eligible families.",
      shortDescription: "Affordable housing scheme for urban and rural areas.",
      eligibility: [
        "Economically Weaker Section (EWS) with annual income up to ₹3 lakh",
        "Lower Income Group (LIG) with annual income ₹3-6 lakh",
        "Middle Income Group (MIG-I) with annual income ₹6-12 lakh",
        "Middle Income Group (MIG-II) with annual income ₹12-18 lakh"
      ],
      benefits: [
        "Interest subsidy up to ₹2.67 lakh",
        "Credit Linked Subsidy Scheme (CLSS)",
        "Affordable Housing in Partnership (AHP)",
        "In-situ Slum Redevelopment (ISSR)",
        "Beneficiary Led Construction (BLC)"
      ],
      documents: [
        "Aadhaar Card",
        "Income certificate",
        "Caste certificate (if applicable)",
        "Bank account details",
        "Property documents (if applicable)"
      ],
      applicationProcess: [
        "Register on PMAY website",
        "Fill application form",
        "Submit required documents",
        "Verification by concerned authority",
        "Approval and subsidy disbursement"
      ],
      benefitsAmount: "Up to ₹2,67,000 (Interest Subsidy)",
      ageLimit: "18+ years",
      incomeLimit: "Up to ₹18 lakh annually",
      lastDate: "March 31, 2024",
      status: 'active',
      priority: 'high',
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      website: "https://pmaymis.gov.in",
      helpline: "1800-11-3377",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "June 25, 2015",
      targetBeneficiaries: "Urban and rural poor",
      budgetAllocated: "₹1,00,000 crores",
      successStories: 12000000,
      rating: 4.7
    },
    {
      id: "pradhan-mantri-kisan-samman-nidhi",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      category: "Agriculture",
      icon: <HandHeart className="w-8 h-8" />,
      description: "A central sector scheme to provide income support to all landholding farmer families across the country to enable them to take care of expenses related to agriculture and allied activities.",
      shortDescription: "Direct income support of ₹6,000 per year to farmers.",
      eligibility: [
        "Small and marginal farmer families",
        "Landholding families",
        "All categories of farmers",
        "No income criteria"
      ],
      benefits: [
        "₹6,000 per year in three equal installments",
        "Direct benefit transfer to bank accounts",
        "No middlemen involved",
        "Covers all farmer families",
        "Additional support for agriculture"
      ],
      documents: [
        "Aadhaar Card",
        "Land records",
        "Bank account details",
        "Mobile number",
        "Passport size photograph"
      ],
      applicationProcess: [
        "Visit nearest Common Service Centre (CSC)",
        "Fill PM-KISAN form",
        "Submit required documents",
        "Verification by local authorities",
        "Approval and payment"
      ],
      benefitsAmount: "₹6,000 per year",
      ageLimit: "No age limit",
      incomeLimit: "No income criteria",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'high',
      color: "text-green-600",
      bgColor: "bg-green-50",
      website: "https://pmkisan.gov.in",
      helpline: "155261",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "February 24, 2019",
      targetBeneficiaries: "All farmer families",
      budgetAllocated: "₹75,000 crores",
      successStories: 110000000,
      rating: 4.9
    },
    {
      id: "pradhan-mantri-suraksha-bima-yojana",
      name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      category: "Insurance",
      icon: <Shield className="w-8 h-8" />,
      description: "A one-year accidental insurance scheme renewable from year to year offering coverage for death or permanent disability due to accident.",
      shortDescription: "Accidental insurance scheme with ₹2 lakh coverage for ₹12 premium.",
      eligibility: [
        "Age group 18-70 years",
        "Having a savings bank account",
        "Aadhaar linked bank account",
        "Valid mobile number"
      ],
      benefits: [
        "₹2 lakh for accidental death",
        "₹2 lakh for permanent total disability",
        "₹1 lakh for permanent partial disability",
        "Premium of only ₹12 per year",
        "Auto-debit from bank account"
      ],
      documents: [
        "Aadhaar Card",
        "Bank account details",
        "Mobile number",
        "Nominee details",
        "Consent form"
      ],
      applicationProcess: [
        "Visit your bank branch",
        "Fill PMSBY form",
        "Submit required documents",
        "Provide consent for auto-debit",
        "Policy activation"
      ],
      benefitsAmount: "₹2,00,000",
      ageLimit: "18-70 years",
      incomeLimit: "No income criteria",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'medium',
      color: "text-red-600",
      bgColor: "bg-red-50",
      website: "https://jansuraksha.gov.in",
      helpline: "1800-180-1111",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "May 9, 2015",
      targetBeneficiaries: "All bank account holders",
      budgetAllocated: "₹1,000 crores",
      successStories: 150000000,
      rating: 4.5
    },
    {
      id: "pradhan-mantri-jeevan-jyoti-bima-yojana",
      name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
      category: "Insurance",
      icon: <Heart className="w-8 h-8" />,
      description: "A one-year life insurance scheme renewable from year to year offering coverage for death due to any reason.",
      shortDescription: "Life insurance scheme with ₹2 lakh coverage for ₹436 premium.",
      eligibility: [
        "Age group 18-50 years",
        "Having a savings bank account",
        "Aadhaar linked bank account",
        "Valid mobile number"
      ],
      benefits: [
        "₹2 lakh for death due to any reason",
        "Premium of ₹436 per year",
        "Auto-debit from bank account",
        "Renewable every year",
        "No medical examination required"
      ],
      documents: [
        "Aadhaar Card",
        "Bank account details",
        "Mobile number",
        "Nominee details",
        "Consent form"
      ],
      applicationProcess: [
        "Visit your bank branch",
        "Fill PMJJBY form",
        "Submit required documents",
        "Provide consent for auto-debit",
        "Policy activation"
      ],
      benefitsAmount: "₹2,00,000",
      ageLimit: "18-50 years",
      incomeLimit: "No income criteria",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'medium',
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      website: "https://jansuraksha.gov.in",
      helpline: "1800-180-1111",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "May 9, 2015",
      targetBeneficiaries: "All bank account holders",
      budgetAllocated: "₹1,500 crores",
      successStories: 120000000,
      rating: 4.4
    },
    {
      id: "pradhan-mantri-kaushal-vikas-yojana",
      name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
      category: "Education",
      icon: <GraduationCap className="w-8 h-8" />,
      description: "A skill development initiative to train youth in industry-relevant skills to enhance their employability and productivity.",
      shortDescription: "Skill development scheme providing free training and certification.",
      eligibility: [
        "Indian citizens aged 15-45 years",
        "School dropouts or unemployed",
        "No formal education required",
        "Priority to SC/ST/women"
      ],
      benefits: [
        "Free skill training",
        "Industry-recognized certification",
        "Placement assistance",
        "Training allowance up to ₹8,000",
        "Job opportunities in various sectors"
      ],
      documents: [
        "Aadhaar Card",
        "Educational certificates",
        "Address proof",
        "Bank account details",
        "Passport size photographs"
      ],
      applicationProcess: [
        "Register on PMKVY portal",
        "Select training center and course",
        "Submit required documents",
        "Attend training program",
        "Get certified and placed"
      ],
      benefitsAmount: "Up to ₹8,000 (Training Allowance)",
      ageLimit: "15-45 years",
      incomeLimit: "No income criteria",
      lastDate: "March 31, 2024",
      status: 'active',
      priority: 'high',
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      website: "https://pmkvyofficial.org",
      helpline: "1800-102-6000",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "July 15, 2015",
      targetBeneficiaries: "Unemployed youth",
      budgetAllocated: "₹12,000 crores",
      successStories: 10000000,
      rating: 4.6
    },
    {
      id: "pradhan-mantri-digital-india",
      name: "Pradhan Mantri Digital India",
      category: "Technology",
      icon: <Smartphone className="w-8 h-8" />,
      description: "A flagship program to transform India into a digitally empowered society and knowledge economy with focus on digital infrastructure, governance, and services.",
      shortDescription: "Digital transformation initiative for e-governance and digital services.",
      eligibility: [
        "All Indian citizens",
        "Businesses and organizations",
        "Government departments",
        "Educational institutions"
      ],
      benefits: [
        "Digital infrastructure development",
        "E-governance services",
        "Digital literacy programs",
        "Startup ecosystem support",
        "Digital payment systems"
      ],
      documents: [
        "Aadhaar Card",
        "Business registration (for businesses)",
        "Educational certificates (for students)",
        "Address proof",
        "Bank account details"
      ],
      applicationProcess: [
        "Visit Digital India portal",
        "Select relevant service",
        "Fill application form",
        "Submit required documents",
        "Get digital services"
      ],
      benefitsAmount: "Varies by service",
      ageLimit: "No age limit",
      incomeLimit: "No income criteria",
      lastDate: "Ongoing",
      status: 'active',
      priority: 'high',
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      website: "https://digitalindia.gov.in",
      helpline: "1800-3000-3468",
      launchedBy: "Prime Minister Narendra Modi",
      launchDate: "July 1, 2015",
      targetBeneficiaries: "All citizens",
      budgetAllocated: "₹1,00,000 crores",
      successStories: 500000000,
      rating: 4.7
    }
  ];

  const categories = [
    { id: "all", name: "All Schemes", icon: <Target className="w-4 h-4" /> },
    { id: "Banking", name: "Banking", icon: <Building2 className="w-4 h-4" /> },
    { id: "Entrepreneurship", name: "Entrepreneurship", icon: <Briefcase className="w-4 h-4" /> },
    { id: "Housing", name: "Housing", icon: <Home className="w-4 h-4" /> },
    { id: "Agriculture", name: "Agriculture", icon: <HandHeart className="w-4 h-4" /> },
    { id: "Insurance", name: "Insurance", icon: <Shield className="w-4 h-4" /> },
    { id: "Education", name: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "Technology", name: "Technology", icon: <Smartphone className="w-4 h-4" /> }
  ];

  const statusOptions = [
    { id: "all", name: "All Status", color: "bg-gray-100" },
    { id: "active", name: "Active", color: "bg-green-100" },
    { id: "upcoming", name: "Upcoming", color: "bg-blue-100" },
    { id: "closed", name: "Closed", color: "bg-red-100" }
  ];

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  }, []);

  const filteredSchemes = governmentSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || scheme.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });


  const formatCurrency = (amount: string) => {
    return amount;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to FinBridge</h2>
              <p className="text-muted-foreground">Please complete your profile to access government schemes.</p>
            </div>
          </div>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Government Schemes</h1>
            <p className="text-muted-foreground">Explore and apply for various government financial schemes</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <Award className="w-3 h-3 mr-1" />
              {filteredSchemes.length} Schemes
            </Badge>
            {/* Test Button */}
            <Button 
              asChild
              variant="outline"
              size="sm"
            >
              <a href="/scheme-details/pradhan-mantri-jan-dhan-yojana">
                Test Navigation
              </a>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search schemes by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-2 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-12 px-4 border-2 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                  <span className="font-medium">
                    {categories.find(c => c.id === selectedCategory)?.name || "All Categories"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
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
          
          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-12 px-4 border-2 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    selectedStatus === "all" ? "bg-gray-400" : 
                    selectedStatus === "active" ? "bg-green-500" :
                    selectedStatus === "upcoming" ? "bg-blue-500" :
                    selectedStatus === "closed" ? "bg-red-500" : "bg-gray-400"
                  }`} />
                  <span className="font-medium">
                    {statusOptions.find(s => s.id === selectedStatus)?.name || "All Status"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    selectedStatus === status.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${
                    selectedStatus === status.id ? "bg-blue-500" : 
                    status.id === "active" ? "bg-green-500" :
                    status.id === "upcoming" ? "bg-blue-500" :
                    status.id === "closed" ? "bg-red-500" : "bg-gray-400"
                  }`} />
                  <span className="font-medium">{status.name}</span>
                  {selectedStatus === status.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="relative group"
              onMouseEnter={() => setHoveredScheme(scheme.id)}
              onMouseLeave={() => setHoveredScheme(null)}
            >
              <Card className={`h-full transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredScheme === scheme.id 
                  ? 'shadow-2xl scale-105 border-2 border-blue-200' 
                  : 'hover:shadow-xl hover:scale-102'
              } ${scheme.bgColor} border-gray-200 hover:border-gray-300`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl ${scheme.bgColor} shadow-lg`}>
                      <div className={scheme.color}>
                        {scheme.icon}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{scheme.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight mb-2">{scheme.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {scheme.shortDescription}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {/* Benefits Amount */}
                  <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Benefits</span>
                        <p className="text-sm font-semibold text-gray-900">{scheme.benefitsAmount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Age Limit */}
                  <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age Limit</span>
                        <p className="text-sm font-semibold text-gray-900">{scheme.ageLimit}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status and Priority */}
                  <div className="flex gap-2">
                    <Badge className={`text-xs font-medium px-3 py-1 ${getStatusColor(scheme.status)}`}>
                      {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                    </Badge>
                    <Badge className={`text-xs font-medium px-3 py-1 ${getPriorityColor(scheme.priority)}`}>
                      {scheme.priority.charAt(0).toUpperCase() + scheme.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  
                  {/* Success Stories */}
                  <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Beneficiaries</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {scheme.successStories.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <Button 
                    asChild
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <a href={`/scheme-details/${scheme.id}`}>
                      <BookOpen className="w-5 h-5 mr-2" />
                      View Details
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Hover Details Overlay */}
              {hoveredScheme === scheme.id && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/98 backdrop-blur-md rounded-xl border-2 border-blue-200 p-6 z-10 shadow-2xl">
                  <div className="h-full overflow-y-auto">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${scheme.bgColor} shadow-lg`}>
                        <div className={scheme.color}>
                          {scheme.icon}
                        </div>
                      </div>
                      <span className="text-gray-800">{scheme.name}</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 text-gray-700">Key Benefits:</h4>
                        <ul className="text-xs space-y-2">
                          {scheme.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 text-gray-700">Eligibility:</h4>
                        <ul className="text-xs space-y-2">
                          {scheme.eligibility.slice(0, 2).map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="font-medium text-gray-600">Benefits:</span>
                          <span className="text-green-600 font-semibold">{scheme.benefitsAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-600">Status:</span>
                          <Badge className={`text-xs font-medium px-2 py-1 ${getStatusColor(scheme.status)}`}>
                            {scheme.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Quick View Button */}
                      <Button 
                        asChild
                        size="sm" 
                        className="w-full mt-4 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <a href={`/scheme-details/${scheme.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full Details
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No schemes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find relevant schemes.
            </p>
          </div>
        )}

        {/* Scheme Statistics */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-gray-800">Scheme Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{governmentSchemes.length}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Schemes</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {governmentSchemes.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Schemes</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {governmentSchemes.filter(s => s.priority === 'high').length}
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">High Priority</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
