import heroImg from "@/assets/hero-travel.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Calendar,
  Users,
  Star,
  PlayCircle,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      {/* Background image with parallax-style layered overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImg}
          alt="Aerial view of a tropical island paradise with turquoise waters"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 gradient-mesh opacity-90" />
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute top-32 right-10 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 left-1/2 h-64 w-64 rounded-full bg-primary-glow/20 blur-3xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-7 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium shadow-soft animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-foreground/80">
                AI-powered trip planning · now in beta
              </span>
              <span className="text-primary font-semibold">→</span>
            </div>

            <h1 className="mt-7 font-display text-[2.75rem] sm:text-6xl lg:text-[5.25rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance animate-fade-in-up">
              Find Travel Buddies &
              <br />
              <span className="text-gradient inline-block">
                Plan Smarter Trips
              </span>
            </h1>

            <p
              className="mt-7 text-lg sm:text-xl text-foreground/65 max-w-xl leading-relaxed text-pretty animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Discover unforgettable destinations, match with like-minded
              travelers, build AI-powered itineraries, and split every expense —
              all in one place.
            </p>

            <div
              className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                variant="hero"
                size="xl"
                className="group shadow-elevated"
              >
                Start Planning
                <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="glass" size="xl" className="group">
                <PlayCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                Explore Trips
              </Button>
            </div>

            {/* Trust row */}
            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center -space-x-3">
                {[
                  "from-primary to-primary-glow",
                  "from-accent to-primary",
                  "from-primary-glow to-accent",
                  "from-primary to-accent",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} ring-[3px] ring-background shadow-soft`}
                  />
                ))}
                <div className="h-10 w-10 rounded-full bg-card grid place-items-center text-[10px] font-bold ring-[3px] ring-background shadow-soft">
                  +120K
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                  <span className="ml-1.5 font-semibold">4.9</span>
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  Loved by 120,000+ travelers worldwide
                </div>
              </div>
            </div>
          </div>

          {/* Right: Floating preview cards */}
          <div
            className="lg:col-span-5 relative hidden lg:block animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative h-[520px]">
              {/* Search card */}
              <div className="absolute top-0 right-0 w-[360px] glass rounded-3xl p-3 shadow-elevated">
                <div className="space-y-1.5">
                  <SearchField
                    icon={MapPin}
                    label="Where"
                    value="Bali, Indonesia"
                  />
                  <SearchField
                    icon={Calendar}
                    label="When"
                    value="Mar 12 – 22"
                  />
                  <SearchField
                    icon={Users}
                    label="Buddies"
                    value="2 travelers"
                  />
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  className="mt-3 w-full rounded-2xl"
                >
                  <Search className="h-4 w-4" />
                  Explore trips
                </Button>
              </div>

              {/* Buddy match floating card */}
              <div
                className="absolute bottom-12 -left-4 w-[280px] glass rounded-2xl p-4 shadow-elevated animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-xl gradient-hero grid place-items-center text-primary-foreground font-bold shadow-glow">
                    SR
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-card border-2 border-card grid place-items-center">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      Sara matched with you
                    </div>
                    <div className="text-xs text-muted-foreground">
                      96% compatibility · Bali
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats floating card */}
              <div
                className="absolute bottom-0 right-8 w-[220px] glass rounded-2xl p-4 shadow-elevated animate-float"
                style={{ animationDelay: "2.5s" }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Trip generated
                </div>
                <div className="mt-1 font-display text-2xl font-bold">
                  4 days · Bali
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Itinerary ready in 2.4s
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search card */}
        <div
          className="lg:hidden mt-10 glass rounded-3xl p-3 shadow-elevated max-w-2xl animate-scale-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <SearchField icon={MapPin} label="Where" value="Bali, Indonesia" />
            <SearchField icon={Calendar} label="When" value="Mar 12 – 22" />
            <SearchField icon={Users} label="Buddies" value="2 travelers" />
          </div>
          <Button variant="hero" size="lg" className="mt-3 w-full rounded-2xl">
            <Search className="h-4 w-4" />
            Explore trips
          </Button>
        </div>

        {/* Stats strip */}
        <div
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { k: "120K+", v: "Travelers" },
            { k: "85+", v: "Countries" },
            { k: "4.9★", v: "App rating" },
            { k: "$2M+", v: "Split fairly" },
          ].map((s) => (
            <div key={s.v} className="border-l-2 border-primary/30 pl-4">
              <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gradient">
                {s.k}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SearchField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <button className="text-left w-full rounded-2xl px-4 py-3 hover:bg-white/70 transition-smooth group">
    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.12em]">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-smooth">
      {value}
    </div>
  </button>
);
