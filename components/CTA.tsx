import { Button } from "@/components/ui/button";
import { ArrowRight, Apple, Smartphone } from "lucide-react";

export const CTA = () => {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero p-10 sm:p-16 lg:p-20 shadow-card">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight leading-tight">
              Your next adventure starts today.
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              Join 120,000+ travelers planning smarter trips, finding their tribe, and making memories that last.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="warm" size="xl" className="group">
                Get started free
                <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="glass" size="xl" className="text-primary-foreground border-white/30 hover:bg-white/20">
                <Apple className="h-5 w-5" />
                Download app
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/75">
              <Smartphone className="h-4 w-4" />
              No credit card required · iOS & Android
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
