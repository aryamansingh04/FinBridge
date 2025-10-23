import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ArrowRight, Check } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', native: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ne', name: 'नेपाली', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'ur', name: 'اردو', native: 'اردو', flag: '🇵🇰' },
];

export const LanguagePreference = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    
    // Change language immediately
    await i18n.changeLanguage(selectedLanguage);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', selectedLanguage);
    
    // Small delay for smooth transition
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify');
    }, 500);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Choose Your Preferred Language</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Select the language you'd like to use for your FinBridge experience
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          {/* Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "outline"}
                className={`h-auto p-4 flex items-center justify-between transition-all duration-200 ${
                  selectedLanguage === language.code 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => handleLanguageSelect(language.code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base">
                      {language.native}
                    </div>
                    <div className="text-xs opacity-75">
                      {language.name}
                    </div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            ))}
          </div>

          {/* Selected Language Preview */}
          {selectedLanguage && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-sm mb-2">Preview:</h4>
              <p className="text-sm text-muted-foreground">
                Selected language: <span className="font-medium">
                  {languages.find(lang => lang.code === selectedLanguage)?.native}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All FinBridge content will be displayed in this language
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              className="flex-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-semibold"
            >
              {isLoading ? (
                t('languagePreference.settingUp')
              ) : (
                <>
                  {t('common.continue')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
            >
{t('languagePreference.backToHome')}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
{t('languagePreference.helpText')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
