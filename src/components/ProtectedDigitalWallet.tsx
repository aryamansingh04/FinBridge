import { useState, useEffect } from "react";
import { usePasscode } from "@/contexts/PasscodeContext";
import { PasscodeEntry } from "./PasscodeEntry";
import { DigitalWallet } from "../pages/DigitalWallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ProtectedDigitalWallet = () => {
  const { t } = useTranslation();
  const { isWalletUnlocked, setWalletUnlocked, hasPasscode, clearPasscode } = usePasscode();
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // If no passcode is set up, show setup screen
  if (!hasPasscode) {
    return (
      <PasscodeEntry
        isSetup={true}
        onSuccess={() => {
          setWalletUnlocked(true);
          setShowSetup(false);
        }}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  // If wallet is not unlocked, show passcode entry
  if (!isWalletUnlocked) {
    return (
      <PasscodeEntry
        onSuccess={() => setWalletUnlocked(true)}
        onCancel={() => window.history.back()}
      />
    );
  }

  // If wallet is unlocked, show the digital wallet with security controls
  return (
    <div className="relative">
      {/* Security Header */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-success">
                {t('digitalWallet.walletSecured') || "Wallet Secured"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('digitalWallet.walletUnlocked') || "Your wallet is unlocked and secure"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {t('digitalWallet.securitySettings') || "Security"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalletUnlocked(false)}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {t('digitalWallet.lockWallet') || "Lock Wallet"}
            </Button>
          </div>
        </div>
      </div>

      {/* Security Settings Panel */}
      {showSettings && (
        <Card className="m-4 border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Shield className="w-5 h-5" />
              {t('digitalWallet.securitySettings') || "Security Settings"}
            </CardTitle>
            <CardDescription>
              {t('digitalWallet.manageWalletSecurity') || "Manage your wallet security settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <h4 className="font-medium">
                  {t('digitalWallet.changePasscode') || "Change Passcode"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('digitalWallet.changePasscodeDescription') || "Update your wallet passcode"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSettings(false);
                  // This would trigger passcode change flow
                }}
              >
                {t('common.change') || "Change"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <h4 className="font-medium">
                  {t('digitalWallet.removePasscode') || "Remove Passcode"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('digitalWallet.removePasscodeDescription') || "Remove passcode protection (not recommended)"}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(t('digitalWallet.confirmRemovePasscode') || "Are you sure you want to remove passcode protection? This will make your wallet less secure.")) {
                    clearPasscode();
                    setShowSettings(false);
                  }
                }}
              >
                {t('common.remove') || "Remove"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Digital Wallet Component */}
      <DigitalWallet />
    </div>
  );
};
