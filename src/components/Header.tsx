import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { FinBridgeLogo } from "./FinBridgeLogo";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<{name: string; initials: string} | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    const signedIn = localStorage.getItem('isSignedIn');
    
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile({
        name: parsedProfile.name,
        initials: parsedProfile.initials
      });
    }
    
    if (signedIn === 'true') {
      setIsSignedIn(true);
    }
  }, []);

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <FinBridgeLogo size="md" />
          
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <a href="#features" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              {t('navigation.features')}
            </a>
            <a href="#savings" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              {t('navigation.savings')}
            </a>
            <a href="#learn" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              {t('navigation.learn')}
            </a>
            <a href="#about" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              {t('navigation.about')}
            </a>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <ThemeToggle />
            {!isSignedIn ? (
              <Button 
                variant="ghost" 
                className="hidden lg:inline-flex text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                onClick={handleSignIn}
              >
                {t('common.signIn')}
              </Button>
            ) : (
              <ProfileDropdown />
            )}
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 sm:h-9 sm:w-9">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
