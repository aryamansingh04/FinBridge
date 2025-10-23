import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MobileVerification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); // 1: Mobile, 2: OTP, 3: Success
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{mobile?: string; otp?: string}>({});

  const validateMobile = (mobile: string) => {
    // Remove all non-digits and check if it's 10 digits starting with 6-9
    const cleaned = mobile.replace(/\D/g, '');
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(cleaned);
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {mobile?: string} = {};

    if (!mobileNumber) {
      newErrors.mobile = t('mobileVerification.mobileRequired');
    } else if (!validateMobile(mobileNumber)) {
      newErrors.mobile = t('mobileVerification.invalidMobile');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep(2);
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({otp: t('mobileVerification.otpRequired')});
      return;
    }

    setErrors({});
    setIsVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep(3);
    }, 800);
  };

  const formatMobileNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    // If user enters 9 digits, assume they want to add a leading digit
    if (cleaned.length === 9 && cleaned[0] >= '4' && cleaned[0] <= '9') {
      const formatted = cleaned.replace(/(\d{5})(\d{4})/, '$1 $2');
      return formatted;
    }
    
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return cleaned.slice(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  if (verificationStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-success">{t('mobileVerification.successTitle')}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('mobileVerification.successSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
            <div className="bg-success/10 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-success font-medium">
                {t('mobileVerification.completeProfile')}
              </p>
            </div>
            <Button 
              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold" 
              onClick={() => navigate('/profile')}
            >
              {t('mobileVerification.completeProfile')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl">{t('mobileVerification.otpTitle')}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('mobileVerification.otpSubtitle')} {mobileNumber}
            </CardDescription>
            <div className="bg-muted/50 p-3 rounded-lg mt-2">
              <p className="text-xs text-muted-foreground text-center">
                {t('mobileVerification.demoOtp')} <span className="font-mono font-bold">123456</span>
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm sm:text-base">{t('mobileVerification.enterOtp')}</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    if (errors.otp) setErrors({...errors, otp: undefined});
                  }}
                  className="text-center text-base sm:text-lg tracking-widest h-10 sm:h-11"
                  maxLength={6}
                />
                {errors.otp && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-xs sm:text-sm">{errors.otp}</AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold" 
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? t('mobileVerification.verifying') : t('mobileVerification.verifyOtp')}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs sm:text-sm"
                  onClick={() => setVerificationStep(1)}
                >
                  {t('mobileVerification.changeMobile')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">{t('mobileVerification.title')}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('mobileVerification.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleMobileSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm sm:text-base">{t('mobileVerification.mobileNumber')}</Label>
              <Input
                id="mobile"
                type="text"
                placeholder="98765 43210"
                value={mobileNumber}
                onChange={(e) => {
                  const formatted = formatMobileNumber(e.target.value);
                  setMobileNumber(formatted);
                  if (errors.mobile) setErrors({...errors, mobile: undefined});
                }}
                className="text-center text-base sm:text-lg tracking-widest h-10 sm:h-11"
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground text-center">
                {t('mobileVerification.mobilePlaceholder')}
              </p>
              {errors.mobile && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">{errors.mobile}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                {t('mobileVerification.smsConsent')}
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold" 
              disabled={isVerifying || !mobileNumber}
            >
              {isVerifying ? t('mobileVerification.sendingOtp') : t('mobileVerification.sendOtp')}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleBackToLanding}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t('auth.backToHome')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
