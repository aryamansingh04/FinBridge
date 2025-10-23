import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা', native: 'বাংলা' },
  { code: 'te', name: 'తెలుగు', native: 'తెలుగు' },
  { code: 'mr', name: 'मराठी', native: 'मराठी' },
  { code: 'ta', name: 'தமிழ்', native: 'தமிழ்' },
  { code: 'gu', name: 'ગુજરાતી', native: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ' },
  { code: 'or', name: 'ଓଡ଼ିଆ', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'অসমীয়া', native: 'অসমীয়া' },
  { code: 'ml', name: 'മലയാളം', native: 'മലയാളം' },
  { code: 'ne', name: 'नेपाली', native: 'नेपाली' },
  { code: 'ur', name: 'اردو', native: 'اردو' },
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="font-medium">{language.native}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {language.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
