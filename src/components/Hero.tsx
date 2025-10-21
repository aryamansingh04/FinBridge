import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10 -z-10" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Your Path to{" "}
              <span className="text-primary">Financial Freedom</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Save, learn, and grow with FinBridge. Simple financial tools designed for everyone, 
              powered by AI guidance in your language.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
              <Button size="lg" className="group w-full sm:w-auto">
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4 md:pt-6">
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary">10,000+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="w-px h-10 md:h-12 bg-border" />
              <div>
                <p className="text-xl md:text-2xl font-bold text-success">₹50L+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Saved Together</p>
              </div>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0 order-first lg:order-last">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <img 
              src={heroIllustration} 
              alt="Financial empowerment illustration" 
              className="relative rounded-xl md:rounded-2xl shadow-lg w-full max-w-md mx-auto lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
