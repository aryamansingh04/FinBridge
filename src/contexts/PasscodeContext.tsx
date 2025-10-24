import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PasscodeContextType {
  isWalletUnlocked: boolean;
  setWalletUnlocked: (unlocked: boolean) => void;
  verifyPasscode: (passcode: string) => boolean;
  setPasscode: (passcode: string) => void;
  hasPasscode: boolean;
  clearPasscode: () => void;
}

const PasscodeContext = createContext<PasscodeContextType | undefined>(undefined);

const STORAGE_KEY = 'walletPasscode';
const SESSION_KEY = 'walletUnlocked';

export const PasscodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isWalletUnlocked, setIsWalletUnlocked] = useState<boolean>(() => {
    // Check if wallet was unlocked in this session
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  
  const [storedPasscode, setStoredPasscode] = useState<string | null>(() => {
    // Load passcode from localStorage
    return localStorage.getItem(STORAGE_KEY);
  });

  // Save session state
  useEffect(() => {
    if (isWalletUnlocked) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [isWalletUnlocked]);

  const verifyPasscode = (passcode: string): boolean => {
    if (!storedPasscode) {
      return false;
    }
    return passcode === storedPasscode;
  };

  const setPasscode = (passcode: string) => {
    setStoredPasscode(passcode);
    localStorage.setItem(STORAGE_KEY, passcode);
  };

  const clearPasscode = () => {
    setStoredPasscode(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsWalletUnlocked(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const setWalletUnlocked = (unlocked: boolean) => {
    setIsWalletUnlocked(unlocked);
  };

  const value: PasscodeContextType = {
    isWalletUnlocked,
    setWalletUnlocked,
    verifyPasscode,
    setPasscode,
    hasPasscode: !!storedPasscode,
    clearPasscode,
  };

  return (
    <PasscodeContext.Provider value={value}>
      {children}
    </PasscodeContext.Provider>
  );
};

export const usePasscode = (): PasscodeContextType => {
  const context = useContext(PasscodeContext);
  if (context === undefined) {
    throw new Error('usePasscode must be used within a PasscodeProvider');
  }
  return context;
};
