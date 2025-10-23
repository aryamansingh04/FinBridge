import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const goals = [
  {
    title: "Emergency Fund",
    current: 15000,
    target: 25000,
    icon: "🛡️",
    color: "primary" as const,
  },
  {
    title: "New Bike",
    current: 42000,
    target: 60000,
    icon: "🏍️",
    color: "success" as const,
  },
  {
    title: "Home Renovation",
    current: 18000,
    target: 100000,
    icon: "🏠",
    color: "accent" as const,
  },
];

export const SavingsDemo = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl">Track Your Dreams</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Set goals that matter to you and watch your savings grow. 
              Visual progress tracking keeps you motivated every step of the way.
            </p>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4 pt-2 md:pt-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-semibold mb-1 text-xs sm:text-sm md:text-base">Smart Savings Tips</p>
                  <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">
                    Get AI-powered suggestions on how to save more based on your spending patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm sm:text-lg md:text-xl">🎯</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold mb-1 text-xs sm:text-sm md:text-base">Milestone Celebrations</p>
                  <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">
                    Celebrate each milestone with rewards and encouragement
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Button size="lg" variant="success" className="mt-3 sm:mt-4 md:mt-6 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base">
                Start Saving Today
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4 order-1 lg:order-2">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.title} className="shadow-md">
                  <CardHeader className="pb-2 md:pb-3 p-3 sm:p-4 md:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{goal.icon}</span>
                        <div className="min-w-0">
                          <CardTitle className="text-sm sm:text-base md:text-lg truncate">{goal.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-xs md:text-sm">
                            ₹{goal.current.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}
                          </CardDescription>
                        </div>
                      </div>
                      <span className="text-xs sm:text-xs md:text-sm font-semibold text-muted-foreground flex-shrink-0">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <Progress value={progress} variant={goal.color} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
