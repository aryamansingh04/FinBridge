import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { usePasscode } from "@/contexts/PasscodeContext";

interface PasscodeEntryProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isSetup?: boolean; // If true, this is for setting up a new passcode
  title?: string;
  description?: string;
}

export const PasscodeEntry: React.FC<PasscodeEntryProps> = ({
  onSuccess,
  onCancel,
  isSetup = false,
  title,
  description
}) => {
  const { t } = useTranslation();
  const { verifyPasscode, setPasscode, hasPasscode } = usePasscode();
  
  const [passcode, setPasscodeValue] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const defaultTitle = isSetup 
    ? t('digitalWallet.setupPasscode') || "Set Up Wallet Passcode"
    : t('digitalWallet.enterPasscode') || "Enter Wallet Passcode";
  
  const defaultDescription = isSetup
    ? t('digitalWallet.setupPasscodeDescription') || "Create a secure 6-digit passcode to protect your digital wallet"
    : t('digitalWallet.enterPasscodeDescription') || "Enter your 6-digit passcode to access your digital wallet";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSetup) {
        // Setup mode - validate and set new passcode
        if (passcode.length !== 6 || !/^\d+$/.test(passcode)) {
          setError(t('digitalWallet.passcodeInvalid') || "Passcode must be 6 digits");
          return;
        }
        
        if (passcode !== confirmPasscode) {
          setError(t('digitalWallet.passcodeMismatch') || "Passcodes do not match");
          return;
        }
        
        setPasscode(passcode);
        onSuccess?.();
      } else {
        // Verification mode - check existing passcode
        if (passcode.length !== 6 || !/^\d+$/.test(passcode)) {
          setError(t('digitalWallet.passcodeInvalid') || "Passcode must be 6 digits");
          return;
        }
        
        if (verifyPasscode(passcode)) {
          onSuccess?.();
        } else {
          setError(t('digitalWallet.passcodeIncorrect') || "Incorrect passcode");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setPasscodeValue(digitsOnly);
    setError("");
  };

  const handleConfirmPasscodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setConfirmPasscode(digitsOnly);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {isSetup ? (
              <Shield className="w-8 h-8 text-primary" />
            ) : (
              <Lock className="w-8 h-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {title || defaultTitle}
          </CardTitle>
          <CardDescription>
            {description || defaultDescription}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="passcode">
                {isSetup 
                  ? (t('digitalWallet.newPasscode') || "New Passcode")
                  : (t('digitalWallet.passcode') || "Passcode")
                }
              </Label>
              <div className="relative">
                <Input
                  id="passcode"
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => handlePasscodeChange(e.target.value)}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest pr-10"
                  maxLength={6}
                  autoComplete="off"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPasscode(!showPasscode)}
                >
                  {showPasscode ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isSetup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPasscode">
                  {t('digitalWallet.confirmPasscode') || "Confirm Passcode"}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPasscode"
                    type={showConfirmPasscode ? "text" : "password"}
                    value={confirmPasscode}
                    onChange={(e) => handleConfirmPasscodeChange(e.target.value)}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest pr-10"
                    maxLength={6}
                    autoComplete="off"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                  >
                    {showConfirmPasscode ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {t('common.cancel') || "Cancel"}
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || passcode.length !== 6 || (isSetup && confirmPasscode.length !== 6)}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.loading') || "Loading..."}
                  </div>
                ) : isSetup ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t('digitalWallet.setupPasscode') || "Set Up Passcode"}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {t('digitalWallet.unlockWallet') || "Unlock Wallet"}
                  </div>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {isSetup 
                ? (t('digitalWallet.passcodeSecurityNote') || "Your passcode is encrypted and stored securely on your device")
                : (t('digitalWallet.forgotPasscode') || "Forgot your passcode? Contact support for assistance")
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
