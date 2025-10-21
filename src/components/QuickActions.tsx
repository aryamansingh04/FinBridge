import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Target, MessageCircle, BookOpen } from "lucide-react";

const actions = [
  {
    icon: Wallet,
    label: "Add Money",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Target,
    label: "New Goal",
    gradient: "from-success/20 to-success/5",
    iconColor: "text-success",
  },
  {
    icon: MessageCircle,
    label: "Ask AI",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: BookOpen,
    label: "Learn",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
];

export const QuickActions = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <h3 className="text-center mb-8">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.label}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2"
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${action.iconColor}`} />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
