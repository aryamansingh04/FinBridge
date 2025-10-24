import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Heart, 
  Car, 
  Home, 
  Plane, 
  Smartphone, 
  Briefcase, 
  Users, 
  CheckCircle, 
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  AlertCircle,
  Info,
  Zap,
  Award,
  Target,
  Activity
} from "lucide-react";

interface InsuranceType {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  coverage: string;
  premium: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  benefits: string[];
  eligibility: string[];
  claimProcess: string[];
  waitingPeriod: string;
  maxCoverage: string;
  networkHospitals: number;
  rating: number;
  reviews: number;
  isActive: boolean;
  color: string;
  bgColor: string;
}

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
}

export const Insurance = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hoveredInsurance, setHoveredInsurance] = useState<string | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceType | null>(null);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activeInsurances, setActiveInsurances] = useState<string[]>([]);

  const insuranceTypes: InsuranceType[] = [
    {
      id: "health",
      name: "Health Insurance",
      category: "Medical",
      icon: <Heart className="w-8 h-8" />,
      description: "Comprehensive health coverage for you and your family with cashless treatment at network hospitals.",
      coverage: "₹5,00,000 - ₹50,00,000",
      premium: { monthly: 2500, yearly: 25000 },
      features: [
        "Cashless treatment at 10,000+ hospitals",
        "Pre & post hospitalization coverage",
        "Day care procedures covered",
        "Maternity benefits included",
        "Annual health check-up"
      ],
      benefits: [
        "No medical tests required up to ₹5L",
        "Instant policy issuance",
        "24/7 customer support",
        "Tax benefits under Section 80D",
        "Lifetime renewability"
      ],
      eligibility: [
        "Age: 18-65 years",
        "Indian resident",
        "No pre-existing conditions (with waiting period)",
        "Valid ID proof required"
      ],
      claimProcess: [
        "Submit claim online or call helpline",
        "Upload required documents",
        "Get pre-authorization for cashless",
        "Receive settlement within 7 days"
      ],
      waitingPeriod: "30 days for illness, 2 years for pre-existing conditions",
      maxCoverage: "₹50,00,000",
      networkHospitals: 10000,
      rating: 4.5,
      reviews: 12500,
      isActive: false,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: "motor",
      name: "Motor Insurance",
      category: "Vehicle",
      icon: <Car className="w-8 h-8" />,
      description: "Complete protection for your vehicle with comprehensive coverage including third-party liability.",
      coverage: "IDV + Third Party Liability",
      premium: { monthly: 800, yearly: 8000 },
      features: [
        "Comprehensive & Third Party coverage",
        "Zero depreciation add-on available",
        "Engine protection cover",
        "Roadside assistance 24/7",
        "Personal accident cover"
      ],
      benefits: [
        "Instant policy issuance",
        "Cashless repairs at network garages",
        "Quick claim settlement",
        "No claim bonus up to 50%",
        "Transfer of NCB to new vehicle"
      ],
      eligibility: [
        "Valid driving license",
        "Vehicle registration certificate",
        "Previous policy (if applicable)",
        "Valid pollution certificate"
      ],
      claimProcess: [
        "Report accident immediately",
        "Submit claim form with documents",
        "Vehicle inspection by surveyor",
        "Repair at network garage or reimbursement"
      ],
      waitingPeriod: "No waiting period",
      maxCoverage: "Up to IDV of vehicle",
      networkHospitals: 0,
      rating: 4.3,
      reviews: 8900,
      isActive: false,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "home",
      name: "Home Insurance",
      category: "Property",
      icon: <Home className="w-8 h-8" />,
      description: "Protect your home and belongings against natural disasters, theft, and other perils.",
      coverage: "Structure + Contents",
      premium: { monthly: 1200, yearly: 12000 },
      features: [
        "Fire, earthquake, flood coverage",
        "Burglary and theft protection",
        "Alternative accommodation expenses",
        "Public liability coverage",
        "Electronic equipment cover"
      ],
      benefits: [
        "Quick claim processing",
        "Expert loss assessment",
        "Emergency assistance",
        "Flexible sum insured options",
        "No claim bonus available"
      ],
      eligibility: [
        "Property ownership proof",
        "Property valuation certificate",
        "Valid address proof",
        "Property inspection may be required"
      ],
      claimProcess: [
        "Report incident immediately",
        "Submit claim with supporting documents",
        "Surveyor inspection",
        "Claim settlement within 15 days"
      ],
      waitingPeriod: "15 days for burglary, 7 days for fire",
      maxCoverage: "Up to ₹2 crores",
      networkHospitals: 0,
      rating: 4.4,
      reviews: 5600,
      isActive: false,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "travel",
      name: "Travel Insurance",
      category: "Travel",
      icon: <Plane className="w-8 h-8" />,
      description: "Comprehensive travel protection for domestic and international trips with medical emergency coverage.",
      coverage: "Medical + Trip Protection",
      premium: { monthly: 0, yearly: 0 },
      features: [
        "Emergency medical expenses",
        "Trip cancellation & interruption",
        "Baggage loss & delay",
        "Personal accident cover",
        "Emergency evacuation"
      ],
      benefits: [
        "Instant policy activation",
        "24/7 global assistance",
        "Cashless medical treatment",
        "Quick claim settlement",
        "Coverage for adventure sports"
      ],
      eligibility: [
        "Age: 3 months to 70 years",
        "Valid passport for international",
        "Travel booking confirmation",
        "No pre-existing medical conditions"
      ],
      claimProcess: [
        "Contact emergency helpline",
        "Submit claim with receipts",
        "Medical certificate if required",
        "Reimbursement within 7 days"
      ],
      waitingPeriod: "No waiting period",
      maxCoverage: "₹50,00,000",
      networkHospitals: 0,
      rating: 4.6,
      reviews: 3200,
      isActive: false,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "mobile",
      name: "Mobile Insurance",
      category: "Gadgets",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Protect your smartphone against accidental damage, theft, and liquid damage.",
      coverage: "Accidental + Theft + Liquid",
      premium: { monthly: 200, yearly: 2000 },
      features: [
        "Accidental damage coverage",
        "Theft and robbery protection",
        "Liquid damage cover",
        "Screen replacement",
        "Battery replacement"
      ],
      benefits: [
        "Quick repair or replacement",
        "No depreciation on parts",
        "Doorstep service available",
        "Original parts guarantee",
        "Instant claim processing"
      ],
      eligibility: [
        "Mobile phone purchase proof",
        "IMEI number verification",
        "Phone in working condition",
        "Valid warranty period"
      ],
      claimProcess: [
        "Report damage/theft immediately",
        "Submit claim with photos",
        "Device inspection",
        "Repair or replacement within 3 days"
      ],
      waitingPeriod: "7 days from policy start",
      maxCoverage: "Up to ₹1,00,000",
      networkHospitals: 0,
      rating: 4.2,
      reviews: 1800,
      isActive: false,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: "term",
      name: "Term Life Insurance",
      category: "Life",
      icon: <Users className="w-8 h-8" />,
      description: "Affordable life insurance providing financial security to your family in case of unfortunate events.",
      coverage: "Death Benefit",
      premium: { monthly: 1500, yearly: 15000 },
      features: [
        "High sum assured at low premium",
        "Flexible premium payment terms",
        "Tax benefits under Section 80C",
        "No medical tests up to ₹50L",
        "Accidental death benefit"
      ],
      benefits: [
        "Instant policy issuance",
        "Flexible coverage options",
        "Easy claim settlement",
        "Nominee benefits",
        "Policy loan facility"
      ],
      eligibility: [
        "Age: 18-65 years",
        "Indian resident",
        "Valid ID and address proof",
        "Income proof required"
      ],
      claimProcess: [
        "Submit death certificate",
        "Provide policy documents",
        "Nominee verification",
        "Settlement within 30 days"
      ],
      waitingPeriod: "No waiting period for natural death",
      maxCoverage: "₹1,00,00,000",
      networkHospitals: 0,
      rating: 4.7,
      reviews: 15600,
      isActive: false,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }

    // Load active insurances from localStorage
    const savedActiveInsurances = localStorage.getItem('activeInsurances');
    if (savedActiveInsurances) {
      setActiveInsurances(JSON.parse(savedActiveInsurances));
    }
  }, []);

  const handleActivateInsurance = async (insurance: InsuranceType) => {
    if (activeInsurances.includes(insurance.id)) {
      return; // Already active, do nothing
    }
    
    setIsActivating(true);
    
    try {
      // Simulate activation process with realistic steps
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to active insurances
      const updatedActiveInsurances = [...activeInsurances, insurance.id];
      setActiveInsurances(updatedActiveInsurances);
      localStorage.setItem('activeInsurances', JSON.stringify(updatedActiveInsurances));
      
      // Show success feedback
      toast({
        title: "Insurance Activated Successfully! 🎉",
        description: `Your ${insurance.name} policy is now active and protecting you.`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error activating insurance:', error);
      toast({
        title: "Activation Failed",
        description: "There was an error activating your insurance. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsActivating(false);
      // Keep modal open to show success state
      // setIsActivationOpen(false);
      // setSelectedInsurance(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPremiumText = (premium: { monthly: number; yearly: number }) => {
    if (premium.monthly === 0 && premium.yearly === 0) {
      return "Pay per trip";
    }
    return `From ${formatCurrency(premium.monthly)}/month`;
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to FinBridge</h2>
              <p className="text-muted-foreground">Please complete your profile to access insurance services.</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Insurance Center</h1>
            <p className="text-muted-foreground">Protect what matters most with comprehensive insurance coverage</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-3 h-3 mr-1" />
              {activeInsurances.length} Active
            </Badge>
          </div>
        </div>

        {/* Active Insurances Summary */}
        {activeInsurances.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Your Active Insurance Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeInsurances.map(insuranceId => {
                  const insurance = insuranceTypes.find(i => i.id === insuranceId);
                  if (!insurance) return null;
                  
                  return (
                    <div key={insuranceId} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className={`p-2 rounded-full ${insurance.bgColor}`}>
                        <div className={insurance.color}>
                          {insurance.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">{insurance.name}</h4>
                        <p className="text-sm text-green-600">Active Policy</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insurance Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insuranceTypes.map((insurance) => (
            <div
              key={insurance.id}
              className="relative group"
              onMouseEnter={() => setHoveredInsurance(insurance.id)}
              onMouseLeave={() => setHoveredInsurance(null)}
            >
              <Card className={`h-full transition-all duration-300 cursor-pointer ${
                hoveredInsurance === insurance.id 
                  ? 'shadow-xl scale-105 border-2' 
                  : 'hover:shadow-lg'
              } ${insurance.bgColor} border-gray-200`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${insurance.bgColor}`}>
                      <div className={insurance.color}>
                        {insurance.icon}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{insurance.rating}</span>
                      <span className="text-xs text-muted-foreground">({insurance.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{insurance.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {insurance.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Coverage */}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Coverage:</span>
                    <span className="text-sm text-muted-foreground">{insurance.coverage}</span>
                  </div>
                  
                  {/* Premium */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Premium:</span>
                    <span className="text-sm text-muted-foreground">{getPremiumText(insurance.premium)}</span>
                  </div>
                  
                  {/* Category Badge */}
                  <Badge variant="outline" className="text-xs">
                    {insurance.category}
                  </Badge>
                  
                  {/* Activate Button */}
                  <Button 
                    className="w-full"
                    variant={activeInsurances.includes(insurance.id) ? "secondary" : "default"}
                    disabled={activeInsurances.includes(insurance.id)}
                    onClick={() => {
                      setSelectedInsurance(insurance);
                      setIsActivationOpen(true);
                    }}
                  >
                    {activeInsurances.includes(insurance.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Active
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Activate Now
                      </>
                    )}
                  </Button>
                  
                  {/* Modal Dialog */}
                  <Dialog open={isActivationOpen && selectedInsurance?.id === insurance.id} onOpenChange={setIsActivationOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${insurance.bgColor}`}>
                            <div className={insurance.color}>
                              {insurance.icon}
                            </div>
                          </div>
                          {insurance.name}
                        </DialogTitle>
                        <DialogDescription>
                          {insurance.description}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Key Features */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {insurance.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Benefits
                          </h4>
                          <ul className="space-y-2">
                            {insurance.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Eligibility */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Eligibility
                          </h4>
                          <ul className="space-y-2">
                            {insurance.eligibility.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Claim Process */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Claim Process
                          </h4>
                          <ol className="space-y-2">
                            {insurance.claimProcess.map((step, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        {/* Important Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Waiting Period</h5>
                            <p className="text-sm text-muted-foreground">{insurance.waitingPeriod}</p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Maximum Coverage</h5>
                            <p className="text-sm text-muted-foreground">{insurance.maxCoverage}</p>
                          </div>
                          {insurance.networkHospitals > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Network Hospitals</h5>
                              <p className="text-sm text-muted-foreground">{insurance.networkHospitals.toLocaleString()}+ hospitals</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Premium Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium mb-2">Premium Options</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly</p>
                              <p className="font-semibold">{formatCurrency(insurance.premium.monthly)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Yearly</p>
                              <p className="font-semibold">{formatCurrency(insurance.premium.yearly)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Activation Button */}
                        <div className="space-y-3">
                          <Button 
                            className="w-full h-12 text-base font-semibold" 
                            size="lg"
                            onClick={() => handleActivateInsurance(insurance)}
                            disabled={isActivating || activeInsurances.includes(insurance.id)}
                            variant={activeInsurances.includes(insurance.id) ? "secondary" : "default"}
                          >
                            {isActivating ? (
                              <>
                                <Clock className="w-5 h-5 mr-2 animate-spin" />
                                Activating Your Policy...
                              </>
                            ) : activeInsurances.includes(insurance.id) ? (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Policy Already Active
                              </>
                            ) : (
                              <>
                                <Zap className="w-5 h-5 mr-2" />
                                Activate Insurance Policy
                              </>
                            )}
                          </Button>
                          
                          {/* Additional Info for Activation */}
                          {!activeInsurances.includes(insurance.id) && !isActivating && (
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Click to activate your {insurance.name.toLowerCase()} policy
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Premium: {getPremiumText(insurance.premium)}
                              </p>
                            </div>
                          )}
                          
                          {/* Success Message */}
                          {activeInsurances.includes(insurance.id) && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Policy Activated Successfully!
                                </span>
                              </div>
                              <p className="text-xs text-green-600 mt-1">
                                Your {insurance.name.toLowerCase()} is now active and protecting you.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              
              {/* Hover Details Overlay */}
              {hoveredInsurance === insurance.id && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-blue-200 p-4 z-10 shadow-xl">
                  <div className="h-full overflow-y-auto">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <div className={`p-2 rounded-full ${insurance.bgColor}`}>
                        <div className={insurance.color}>
                          {insurance.icon}
                        </div>
                      </div>
                      {insurance.name}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Key Features:</h4>
                        <ul className="text-xs space-y-1">
                          {insurance.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Benefits:</h4>
                        <ul className="text-xs space-y-1">
                          {insurance.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <TrendingUp className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Premium:</span>
                          <span className="text-green-600 font-semibold">{getPremiumText(insurance.premium)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{insurance.rating}</span>
                          </div>
                        </div>
                        
                        {/* View Details Button */}
                        <Button 
                          size="sm" 
                          className="w-full mt-3 text-xs"
                          onClick={() => {
                            setSelectedInsurance(insurance);
                            setIsActivationOpen(true);
                          }}
                        >
                          <Info className="w-3 h-3 mr-1" />
                          {activeInsurances.includes(insurance.id) ? "View Details" : "View Details & Activate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Insurance Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Insurance Tips & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Compare Before Buying</h4>
                <p className="text-xs text-muted-foreground">
                  Always compare coverage, premiums, and benefits from multiple insurers before making a decision.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Read Policy Terms</h4>
                <p className="text-xs text-muted-foreground">
                  Carefully read the policy document to understand exclusions, waiting periods, and claim procedures.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Regular Reviews</h4>
                <p className="text-xs text-muted-foreground">
                  Review your insurance coverage annually to ensure it meets your changing needs and circumstances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
