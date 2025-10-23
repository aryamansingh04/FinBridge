import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { LanguagePreference } from "./pages/LanguagePreference";
import { MobileVerification } from "./pages/MobileVerification";
import { ProfileCompletion } from "./pages/ProfileCompletion";
import { Dashboard } from "./pages/Dashboard";
import { DigitalWallet } from "./pages/DigitalWallet";
import { Transactions } from "./pages/Transactions";
import { DebtRepayment } from "./pages/DebtRepayment";
import { CreditScore } from "./pages/CreditScore";
import { Insurance } from "./pages/Insurance";
import { Schemes } from "./pages/Schemes";
import { SchemeDetails } from "./pages/SchemeDetails";
import { Loan } from "./pages/Loan";
import { Learn } from "./pages/Learn";
import { News } from "./pages/News";
import { WalletProvider } from "./contexts/WalletContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/language-preference" element={<LanguagePreference />} />
              <Route path="/verify" element={<MobileVerification />} />
              <Route path="/profile" element={<ProfileCompletion />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/digital-wallet" element={<DigitalWallet />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/debt-repayment" element={<DebtRepayment />} />
            <Route path="/credit-score" element={<CreditScore />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/scheme-details/:id" element={<SchemeDetails />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/news" element={<News />} />
            <Route path="/old-dashboard" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </NotificationProvider>
      </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
