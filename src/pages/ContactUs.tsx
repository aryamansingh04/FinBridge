import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Headphones,
  MessageSquare,
  Calendar,
  Globe
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
}

export const ContactUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    priority: "medium",
    message: ""
  });

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+91-800-123-4567",
      availability: "24/7 Available",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@finbridge.com",
      availability: "Response within 2 hours",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support agents",
      contact: "Available in app",
      availability: "9 AM - 9 PM IST",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Visit",
      description: "Visit our customer service center",
      contact: "Mumbai, Delhi, Bangalore",
      availability: "Mon-Fri 9 AM - 6 PM",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const categories = [
    { value: "technical", label: "Technical Support" },
    { value: "account", label: "Account Issues" },
    { value: "billing", label: "Billing & Payments" },
    { value: "security", label: "Security Concerns" },
    { value: "feature", label: "Feature Request" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "urgent", label: "Urgent", color: "text-red-600" }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully!",
      description: "We've received your message and will respond within 2 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      priority: "medium",
      message: ""
    });

    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.category && formData.message;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
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
              Contact Support
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get help from our support team. We're here to assist you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    Contact Methods
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred way to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${method.bgColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${method.color} flex-shrink-0 mt-1`}>
                          {method.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{method.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{method.description}</p>
                          <p className="text-sm font-medium mb-1">{method.contact}</p>
                          <Badge variant="outline" className="text-xs">
                            {method.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="h-10 sm:h-auto"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="h-10 sm:h-auto"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="h-10 sm:h-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className="h-10 sm:h-auto"
                          required
                        />
                      </div>
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className="h-10 sm:h-auto">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                          <SelectTrigger className="h-10 sm:h-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <span className={priority.color}>{priority.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide detailed information about your issue or question..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="min-h-[120px] resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        disabled={!isFormValid || isSubmitting}
                        className="flex-1 h-10 sm:h-auto px-6 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate('/faq')}
                        className="h-10 sm:h-auto px-6 py-2 text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Check FAQ First
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Response Time</p>
                        <p className="text-xs text-muted-foreground">Within 2 hours for email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Languages</p>
                        <p className="text-xs text-muted-foreground">English, Hindi, Regional</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Pro Tip: Check FAQ First
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Many common questions are answered in our FAQ section. You might find an instant solution there!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
