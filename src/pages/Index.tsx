import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SavingsDemo } from "@/components/SavingsDemo";
import { QuickActions } from "@/components/QuickActions";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <SavingsDemo />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
