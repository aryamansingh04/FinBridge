import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Edit, LogOut, DollarSign, Briefcase, Bell, Upload, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const occupations = [
  "streetVendor",
  "peasant", 
  "dailyLabourer",
  "artisan",
  "smallScaleEntrepreneur"
];

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
  isSignedIn: boolean;
  signInMethod: string;
}

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUploadStatementOpen, setIsUploadStatementOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    occupation: "",
    monthlySalary: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
      setEditData({
        name: parsedProfile.name,
        occupation: parsedProfile.occupation,
        monthlySalary: parsedProfile.monthlySalary
      });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadStatement = () => {
    if (uploadFile) {
      // Simulate file upload
      console.log('Uploading file:', uploadFile.name);
      setIsUploadStatementOpen(false);
      setUploadFile(null);
    }
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = () => {
    if (contactForm.subject && contactForm.message) {
      // Simulate contact form submission
      console.log('Contact form submitted:', contactForm);
      setIsContactUsOpen(false);
      setContactForm({ subject: "", message: "" });
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateEditForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (editData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!editData.occupation) {
      newErrors.occupation = "Please select your occupation";
    }

    if (!editData.monthlySalary) {
      newErrors.monthlySalary = "Monthly salary is required";
    } else {
      const cleanedSalary = editData.monthlySalary.replace(/[^\d]/g, '');
      if (isNaN(Number(cleanedSalary)) || Number(cleanedSalary) < 0) {
        newErrors.monthlySalary = "Please enter a valid salary amount";
      }
    }

    return newErrors;
  };

  const handleSaveEdit = async () => {
    const newErrors = validateEditForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      const updatedProfile = {
        ...userProfile,
        name: editData.name,
        occupation: editData.occupation,
        monthlySalary: editData.monthlySalary,
        initials: editData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        email: `${editData.name.toLowerCase().replace(/\s+/g, '.')}@finbridge.com`
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setIsEditOpen(false);
      setErrors({});
    }, 1000);
  };

  const formatSalary = (value: string) => {
    // Remove all non-digit characters including currency symbols
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned) {
      return new Intl.NumberFormat('en-IN').format(Number(cleaned));
    }
    return cleaned;
  };

  if (!userProfile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/20 hover:bg-primary/30">
          <span className="text-primary font-semibold text-sm">
            {userProfile.initials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 sm:w-72">
        <div className="p-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {userProfile.initials}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          {t('navigation.profile')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setIsNotificationsOpen(true)} className="cursor-pointer">
          <Bell className="w-4 h-4 mr-2" />
          {t('digitalWallet.notifications')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setIsUploadStatementOpen(true)} className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {t('digitalWallet.uploadStatement')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setIsContactUsOpen(true)} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('digitalWallet.contactUs')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          {t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {t('common.edit')} {t('navigation.profile')}
            </DialogTitle>
            <DialogDescription>
              Update your personal information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm">{t('profileCompletion.fullNameLabel')}</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Enter your full name"
                value={editData.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                className="h-10"
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Occupation Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-occupation" className="text-sm">{t('profileCompletion.occupationLabel')}</Label>
              <Select value={editData.occupation} onValueChange={(value) => handleEditChange('occupation', value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select your occupation" />
                </SelectTrigger>
                <SelectContent>
                  {occupations.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {t(`profileCompletion.occupation${occupation.charAt(0).toUpperCase() + occupation.slice(1)}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.occupation && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{errors.occupation}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Monthly Salary Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-salary" className="text-sm">Monthly Salary (₹)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-salary"
                  type="text"
                  placeholder="Enter your monthly salary (e.g., 25000)"
                  value={editData.monthlySalary}
                  onChange={(e) => {
                    const formatted = formatSalary(e.target.value);
                    handleEditChange('monthlySalary', formatted);
                  }}
                  className="h-10 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter amount in Indian Rupees (₹) - e.g., 25000 or 1,50,000
              </p>
              {errors.monthlySalary && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{errors.monthlySalary}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Current Profile Display */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Current Profile</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Occupation:</strong> {userProfile.occupation}</p>
                <p><strong>Monthly Salary:</strong> ₹{userProfile.monthlySalary}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 h-10"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                className="h-10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('digitalWallet.notifications')}
            </DialogTitle>
            <DialogDescription>
              Manage your notification preferences and view recent alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recent Notifications</h4>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Loan Application Approved</p>
                  <p className="text-xs text-blue-700">Your personal loan application has been approved. Amount: ₹50,000</p>
                  <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Payment Received</p>
                  <p className="text-xs text-green-700">You received ₹5,000 from John Doe</p>
                  <p className="text-xs text-green-600 mt-1">1 day ago</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-900">Budget Alert</p>
                  <p className="text-xs text-orange-700">You're approaching your monthly budget limit</p>
                  <p className="text-xs text-orange-600 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Notification Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
            <Button onClick={() => setIsNotificationsOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Statement Dialog */}
      <Dialog open={isUploadStatementOpen} onOpenChange={setIsUploadStatementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t('digitalWallet.uploadStatement')}
            </DialogTitle>
            <DialogDescription>
              Upload your bank statement or financial documents for analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drop your file here or click to browse</p>
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </label>
              </div>
              {uploadFile && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">File Selected</p>
                  <p className="text-xs text-green-700">{uploadFile.name}</p>
                  <p className="text-xs text-green-600">Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Supported Formats</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">CSV</Badge>
                <Badge variant="secondary">Excel</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleUploadStatement}
                disabled={!uploadFile}
                className="flex-1"
              >
                Upload Statement
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsUploadStatementOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Us Dialog */}
      <Dialog open={isContactUsOpen} onOpenChange={setIsContactUsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t('digitalWallet.contactUs')}
            </DialogTitle>
            <DialogDescription>
              Get in touch with our support team for assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-sm">Subject</Label>
                <Input
                  id="contact-subject"
                  placeholder="What can we help you with?"
                  value={contactForm.subject}
                  onChange={(e) => handleContactFormChange('subject', e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm">Message</Label>
                <textarea
                  id="contact-message"
                  placeholder="Please describe your issue or question in detail..."
                  value={contactForm.message}
                  onChange={(e) => handleContactFormChange('message', e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">Contact Information</h4>
              <div className="space-y-1 text-xs text-blue-700">
                <p><strong>Email:</strong> support@finbridge.com</p>
                <p><strong>Phone:</strong> +91 1800-123-4567</p>
                <p><strong>Hours:</strong> Mon-Fri 9AM-6PM IST</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleContactSubmit}
                disabled={!contactForm.subject || !contactForm.message}
                className="flex-1"
              >
                Send Message
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsContactUsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};
