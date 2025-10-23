import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Building2, 
  Users, 
  GraduationCap, 
  Heart, 
  Home, 
  Briefcase, 
  Car, 
  Smartphone,
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
  Phone,
  Globe,
  Download,
  Share2,
  Copy,
  AlertCircle,
  User,
  Mail,
  MessageSquare
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

export const SchemeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Government schemes data (same as in Schemes.tsx)
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

  useEffect(() => {
    if (location.state?.scheme) {
      // If scheme data is passed via state, use it
      setScheme(location.state.scheme);
    } else if (id) {
      // If no state but we have an ID, find the scheme by ID
      const foundScheme = governmentSchemes.find(s => s.id === id);
      if (foundScheme) {
        setScheme(foundScheme);
      } else {
        // Scheme not found, redirect back to schemes page
        navigate('/schemes');
      }
    } else {
      // No scheme data and no ID, redirect back to schemes page
      navigate('/schemes');
    }
  }, [location.state, id, navigate, governmentSchemes]);

  const handleApplyNow = async () => {
    setIsApplying(true);
    
    // Simulate application process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsApplying(false);
    setShowApplicationForm(true);
  };

  const handleDownloadForm = () => {
    // Simulate form download
    console.log('Downloading application form for:', scheme?.name);
  };

  const handleShareScheme = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme?.name,
        text: scheme?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
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

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Scheme Not Found</h2>
              <p className="text-muted-foreground">The requested scheme could not be found.</p>
              <Button onClick={() => navigate('/schemes')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Schemes
              </Button>
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
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/schemes')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schemes
        </Button>

        {/* Scheme Header */}
        <Card className={`${scheme.bgColor} border-2`}>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-full ${scheme.bgColor}`}>
                  <div className={scheme.color}>
                    {scheme.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getStatusColor(scheme.status)}`}>
                      {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                    </Badge>
                    <Badge className={`${getPriorityColor(scheme.priority)}`}>
                      {scheme.priority.charAt(0).toUpperCase() + scheme.priority.slice(1)} Priority
                    </Badge>
                    <Badge variant="outline">{scheme.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl mb-2">{scheme.name}</CardTitle>
                  <CardDescription className="text-base">
                    {scheme.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold">{scheme.rating}</span>
                  <span className="text-sm text-muted-foreground">({scheme.successStories.toLocaleString()} beneficiaries)</span>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleApplyNow}
                  disabled={isApplying || scheme.status === 'closed'}
                  className="w-full lg:w-auto"
                >
                  {isApplying ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : scheme.status === 'closed' ? (
                    'Application Closed'
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Benefits Amount</p>
                  <p className="text-lg font-semibold">{scheme.benefitsAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Age Limit</p>
                  <p className="text-lg font-semibold">{scheme.ageLimit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Date</p>
                  <p className="text-lg font-semibold">{scheme.lastDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Stories</p>
                  <p className="text-lg font-semibold">{scheme.successStories.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Benefits & Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scheme.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {scheme.applicationProcess.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scheme.documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Scheme Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Scheme Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Launched By</p>
                  <p className="font-medium">{scheme.launchedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Launch Date</p>
                  <p className="font-medium">{scheme.launchDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Beneficiaries</p>
                  <p className="font-medium">{scheme.targetBeneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Allocated</p>
                  <p className="font-medium">{scheme.budgetAllocated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Income Limit</p>
                  <p className="font-medium">{scheme.incomeLimit}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Helpline</p>
                    <p className="font-medium">{scheme.helpline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a 
                      href={scheme.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Visit Official Website
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownloadForm}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Form
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleShareScheme}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Scheme
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(scheme.website, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </CardContent>
            </Card>

            {/* Application Form Modal */}
            {showApplicationForm && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Application Form Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Your application form for {scheme.name} is ready for download.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={handleDownloadForm}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Application Form
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Success Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Success Stories & Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600">{scheme.successStories.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Beneficiaries</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{scheme.rating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{scheme.budgetAllocated}</div>
                <div className="text-sm text-muted-foreground">Budget Allocated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
