import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <FinBridgeLogo size="md" />
          
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.features')}
            </button>
            <button 
              onClick={() => scrollToSection('savings')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.savings')}
            </button>
            <button 
              onClick={() => handleNavigation('/learn')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.learn')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors"
            >
              {t('navigation.about')}
            </button>
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
            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 sm:h-9 sm:w-9">
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t('navigation.menu') || 'Menu'}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <nav className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => scrollToSection('features')}
                    >
                      {t('navigation.features')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => scrollToSection('savings')}
                    >
                      {t('navigation.savings')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation('/learn')}
                    >
                      {t('navigation.learn')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => scrollToSection('about')}
                    >
                      {t('navigation.about')}
                    </Button>
                    {isSignedIn && (
                      <>
                        <div className="border-t pt-2 mt-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleNavigation('/dashboard')}
                          >
                            {t('navigation.dashboard')}
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleNavigation('/digital-wallet')}
                          >
                            {t('navigation.digitalWallet')}
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleNavigation('/transactions')}
                          >
                            {t('navigation.transactions')}
                          </Button>
                        </div>
                      </>
                    )}
                  </nav>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">{t('common.language') || 'Language'}</span>
                      <LanguageSelector />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('common.theme') || 'Theme'}</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
