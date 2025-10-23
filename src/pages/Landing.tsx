import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FinBridgeLogo } from "@/components/FinBridgeLogo";

export const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    navigate('/language-preference');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-success/90">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4">
                <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer gradient border/outline */}
                  <defs>
                    <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:'#F59E0B', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#D97706', stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Main teardrop shape with gradient border */}
                  <path d="M32 8 C20 8 8 20 8 32 C8 44 20 56 32 56 C44 56 56 44 56 32 C56 20 44 8 32 8 Z" 
                        fill="url(#outerGradient)" 
                        stroke="none"/>
                  
                  {/* Inner dark blue circle */}
                  <circle cx="32" cy="32" r="24" fill="#1E3A8A"/>
                  
                  {/* Bar chart bars */}
                  {/* Left bar (shortest) */}
                  <rect x="22" y="28" width="4" height="8" fill="#10B981" rx="2"/>
                  {/* Middle bar */}
                  <rect x="30" y="24" width="4" height="12" fill="#10B981" rx="2"/>
                  {/* Right bar (tallest) */}
                  <rect x="38" y="20" width="4" height="16" fill="#10B981" rx="2"/>
                  
                  {/* Upward arrows on top of bars */}
                  {/* Left arrow */}
                  <path d="M24 26 L26 24 L28 26 L26 28 Z" fill="url(#goldGradient)"/>
                  {/* Middle arrow */}
                  <path d="M32 22 L34 20 L36 22 L34 24 Z" fill="url(#goldGradient)"/>
                  {/* Right arrow */}
                  <path d="M40 18 L42 16 L44 18 L42 20 Z" fill="url(#goldGradient)"/>
                  
                  {/* Golden bottom band */}
                  <path d="M16 48 Q32 52 48 48" 
                        stroke="url(#goldGradient)" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4">
                {t('brand.name')}
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light">
              {t('landing.title')}
            </p>
          </div>

          {/* Main CTA */}
          <div className="mb-8 sm:mb-12">
            <Button 
              size="lg" 
              className="group bg-white text-primary hover:bg-white/90 text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 h-auto rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              onClick={handleGetStarted}
            >
              {t('common.getStarted')}
              <ArrowRight className="group-hover:translate-x-1 transition-transform ml-2 w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Secure</h3>
              <p className="text-white/80 text-xs sm:text-sm">Bank-level security for your financial data</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Smart</h3>
              <p className="text-white/80 text-xs sm:text-sm">AI-powered insights for better decisions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Simple</h3>
              <p className="text-white/80 text-xs sm:text-sm">Easy-to-use tools for everyone</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-white/80">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">10,000+</p>
                <p className="text-sm sm:text-base">Active Users</p>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/30 hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">₹50L+</p>
                <p className="text-sm sm:text-base">Saved Together</p>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/30 hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">4.9★</p>
                <p className="text-sm sm:text-base">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-success/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-lg animate-pulse delay-500" />
    </div>
  );
};
