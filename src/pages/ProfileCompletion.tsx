import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Briefcase, DollarSign, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotificationHelpers } from "@/contexts/NotificationContext";

const occupations = [
  "streetVendor",
  "peasant", 
  "dailyLabourer",
  "artisan",
  "smallScaleEntrepreneur"
];

export const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notifyProfile } = useNotificationHelpers();
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    monthlySalary: "",
    shareEarnings: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = t('profile.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('profile.nameMinLength');
    }

    if (!formData.occupation) {
      newErrors.occupation = t('profile.occupationRequired');
    }

    if (!formData.monthlySalary) {
      newErrors.monthlySalary = t('profile.salaryRequired');
    } else {
      const cleanedSalary = formData.monthlySalary.replace(/[^\d]/g, '');
      if (isNaN(Number(cleanedSalary)) || Number(cleanedSalary) < 0) {
        newErrors.monthlySalary = t('profile.salaryRequired');
      }
    }

    if (!formData.shareEarnings) {
      newErrors.shareEarnings = t('profile.shareRequired');
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Store user data as sign-in information
      const userData = {
        name: formData.name,
        occupation: formData.occupation,
        monthlySalary: formData.monthlySalary,
        initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@finbridge.com`, // Generate email
        isSignedIn: true,
        signInMethod: 'mobile'
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userData));
      localStorage.setItem('isSignedIn', 'true');
      localStorage.setItem('userEmail', userData.email);
      
      // Add notification for profile completion
      notifyProfile('completed');
      
      navigate('/dashboard');
    }, 1500);
  };

  const formatSalary = (value: string) => {
    // Remove all non-digit characters including currency symbols
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned) {
      return new Intl.NumberFormat('en-IN').format(Number(cleaned));
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">{t('profile.title')}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('profile.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">{t('profile.fullName')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('profile.fullName')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-10 sm:h-11"
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Occupation Field */}
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-sm sm:text-base">{t('profile.occupation')}</Label>
              <Select value={formData.occupation} onValueChange={(value) => handleInputChange('occupation', value)}>
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue placeholder={t('profile.occupation')} />
                </SelectTrigger>
                <SelectContent>
                  {occupations.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {t(`occupations.${occupation}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.occupation && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">{errors.occupation}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Monthly Salary Field */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm sm:text-base">{t('profile.monthlySalary')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="salary"
                  type="text"
                  placeholder={t('profile.salaryPlaceholder')}
                  value={formData.monthlySalary}
                  onChange={(e) => {
                    const formatted = formatSalary(e.target.value);
                    handleInputChange('monthlySalary', formatted);
                  }}
                  className="h-10 sm:h-11 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('profile.salaryFormat')}
              </p>
              {errors.monthlySalary && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">{errors.monthlySalary}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="shareEarnings"
                  checked={formData.shareEarnings}
                  onCheckedChange={(checked) => handleInputChange('shareEarnings', checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="shareEarnings" className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('profile.shareEarnings')}
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('profile.shareEarnings')}
                  </p>
                </div>
              </div>
              {errors.shareEarnings && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">{errors.shareEarnings}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>{t('profile.dataEncrypted')}</strong> {t('profile.dataCompliance')}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('profile.creatingProfile') : t('profile.completeProfile')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
