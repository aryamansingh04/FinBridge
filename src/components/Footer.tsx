import { FinBridgeLogo } from "./FinBridgeLogo";

export const Footer = () => {
  return (
    <footer className="border-t bg-card py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 sm:col-span-2 lg:col-span-1">
            <FinBridgeLogo size="md" />
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Empowering financial inclusion through simple, accessible tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Features</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Digital Wallet</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Savings Goals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Assistant</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Learning Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Company</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Legal</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 text-center text-xs sm:text-xs md:text-sm text-muted-foreground">
          <p>© 2024 FinBridge. All rights reserved. Building financial freedom for everyone.</p>
        </div>
      </div>
    </footer>
  );
};
