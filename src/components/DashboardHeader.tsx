import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { Menu } from "lucide-react";
import { FinBridgeLogo } from "./FinBridgeLogo";

interface UserProfile {
  name: string;
  occupation: string;
  monthlySalary: string;
  initials: string;
  email: string;
  isSignedIn: boolean;
  signInMethod: string;
}

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    const signedIn = localStorage.getItem('isSignedIn');

    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }

    if (signedIn === 'true') {
      setIsSignedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <FinBridgeLogo size="md" />

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.dashboard')}
            </button>
            <button 
              onClick={() => navigate('/digital-wallet')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.digitalWallet')}
            </button>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.transactions')}
            </button>
            <button 
              onClick={() => navigate('/debt-repayment')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.debtRepayment')}
            </button>
            <button 
              onClick={() => navigate('/loan')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.loan')}
            </button>
            <button 
              onClick={() => navigate('/credit-score')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.creditScore')}
            </button>
            <button 
              onClick={() => navigate('/financial-advisor')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.financialAdvisor')}
            </button>
            <button 
              onClick={() => navigate('/insurance')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.insurance')}
            </button>
            <button 
              onClick={() => navigate('/schemes')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.schemes')}
            </button>
            <button 
              onClick={() => navigate('/learn')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.learn')}
            </button>
            <button 
              onClick={() => navigate('/news')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.news')}
            </button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Profile or Sign In */}
            {!isSignedIn ? (
              <Button 
                variant="ghost" 
                className="hidden lg:inline-flex text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                onClick={() => navigate('/signin')}
              >
                {t('common.signIn')}
              </Button>
            ) : (
              <ProfileDropdown />
            )}
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 sm:h-9 sm:w-9">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
