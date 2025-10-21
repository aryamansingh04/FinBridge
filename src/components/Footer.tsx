export const Footer = () => {
  return (
    <footer className="border-t bg-card py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold">FinBridge</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering financial inclusion through simple, accessible tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Digital Wallet</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Savings Goals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Assistant</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Learning Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2024 FinBridge. All rights reserved. Building financial freedom for everyone.</p>
        </div>
      </div>
    </footer>
  );
};
