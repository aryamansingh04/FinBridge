import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface FinBridgeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  clickable?: boolean;
}

export const FinBridgeLogo: React.FC<FinBridgeLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  clickable = true
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const handleLogoClick = () => {
    if (clickable) {
      // Check if user is signed in, if yes go to dashboard, otherwise go to home
      const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
      navigate(isSignedIn ? '/dashboard' : '/');
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={handleLogoClick}
    >
      <div className={sizeClasses[size]}>
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
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>
          {t('brand.name')}
        </span>
      )}
    </div>
  );
};
