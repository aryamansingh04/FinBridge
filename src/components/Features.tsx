import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Target, MessageCircle, BookOpen, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Digital Wallet",
    description: "Track your money, set budgets, and manage expenses effortlessly",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Goal-Based Savings",
    description: "Set savings goals and watch your progress grow with visual trackers",
    color: "text-success",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Get personalized financial advice in Hindi, Tamil, or English",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    title: "Learn & Grow",
    description: "Access government schemes, learn about insurance, and financial basics",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Credit Scoring",
    description: "Build your credit score and unlock micro-loan opportunities",
    color: "text-success",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Bank-level security with encrypted transactions and data protection",
    color: "text-accent",
  },
];

export const Features = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-16">
          <h2 className="mb-2 sm:mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl">Everything You Need to Succeed</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Simple, powerful tools designed for your financial journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="bg-card hover:shadow-md transition-shadow border-2"
              >
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
