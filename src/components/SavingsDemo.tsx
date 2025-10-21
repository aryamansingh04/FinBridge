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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-primary">Track Your Dreams</h2>
            <p className="text-lg text-muted-foreground">
              Set goals that matter to you and watch your savings grow. 
              Visual progress tracking keeps you motivated every step of the way.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Smart Savings Tips</p>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered suggestions on how to save more based on your spending patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Milestone Celebrations</p>
                  <p className="text-sm text-muted-foreground">
                    Celebrate each milestone with rewards and encouragement
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" variant="success" className="mt-6">
              Start Saving Today
            </Button>
          </div>
          
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.title} className="shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <CardDescription>
                            ₹{goal.current.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}
                          </CardDescription>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
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
