import { Button } from "@/components/ui/button";
import { MapPin, Wallet, CalendarRange, Users, Search } from "lucide-react";

const fields = [
  { icon: MapPin, label: "Destination", value: "Bali, Indonesia" },
  { icon: Wallet, label: "Budget", value: "$1,000 – $2,000" },
  { icon: CalendarRange, label: "Duration", value: "7 – 10 days" },
  { icon: Users, label: "Travelers", value: "2 adults" },
];

export const SmartSearch = () => {
  return (
    <section id="explore" className="py-20 sm:py-24 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Smart search
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Find your <span className="text-gradient">perfect trip</span> in seconds
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Filter by destination, budget, duration and group size — we handle the rest.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto glass rounded-3xl p-4 sm:p-5 shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {fields.map((f) => (
              <button
                key={f.label}
                className="text-left rounded-2xl px-4 py-4 hover:bg-white/60 transition-smooth group border border-transparent hover:border-border/60"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <f.icon className="h-3.5 w-3.5 text-primary" />
                  {f.label}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {f.value}
                </div>
              </button>
            ))}
          </div>
          <Button variant="hero" size="lg" className="mt-3 w-full rounded-2xl">
            <Search className="h-4 w-4" />
            Search trips
          </Button>
        </div>
      </div>
    </section>
  );
};
