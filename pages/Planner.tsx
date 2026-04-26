import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Wand2,
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Sun,
  Utensils,
  Camera,
  Mountain,
  Plane,
  Hotel,
  Coffee,
  Loader2,
  RefreshCw,
  Share2,
  Download,
  Heart,
  Users,
  Palmtree,
  Building2,
  Backpack,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const travelTypes = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "honeymoon", label: "Honeymoon", icon: Heart },
  { id: "family", label: "Family", icon: Users },
  { id: "weekend", label: "Weekend", icon: Coffee },
  { id: "beach", label: "Beach", icon: Palmtree },
  { id: "city", label: "City Break", icon: Building2 },
  { id: "backpack", label: "Backpacking", icon: Backpack },
  { id: "luxury", label: "Luxury", icon: Star },
];

const sampleSuggestions = ["Bali, Indonesia", "Lisbon, Portugal", "Kyoto, Japan", "Tulum, Mexico"];

type ItineraryItem = {
  time: string;
  title: string;
  detail: string;
  icon: typeof Sun;
  tag: string;
};

type Day = {
  day: string;
  title: string;
  items: ItineraryItem[];
};

const buildItinerary = (destination: string, days: number): Day[] => {
  const dest = destination || "Bali";
  const templates: Day[] = [
    {
      day: "Day 1",
      title: `Arrive in ${dest} & sunset welcome`,
      items: [
        { time: "14:00", title: "Check-in at boutique stay", detail: "Beachside villa with pool access", icon: Hotel, tag: "Stay" },
        { time: "17:30", title: "Golden hour beach walk", detail: "Seminyak coastline · soft sand", icon: Sun, tag: "Chill" },
        { time: "19:30", title: "Welcome dinner", detail: "Local seafood grill · 4.8★", icon: Utensils, tag: "Foodie" },
      ],
    },
    {
      day: "Day 2",
      title: "Culture & rice terraces",
      items: [
        { time: "08:00", title: "Sunrise at Tegallalang", detail: "Iconic terraced rice fields", icon: Camera, tag: "Photo" },
        { time: "12:00", title: "Ubud market & lunch", detail: "Authentic Nasi Campur · $6", icon: Utensils, tag: "Foodie" },
        { time: "16:00", title: "Sacred Monkey Forest", detail: "Easy 1.5 hr walk", icon: Mountain, tag: "Active" },
      ],
    },
    {
      day: "Day 3",
      title: "Island day trip",
      items: [
        { time: "07:00", title: "Speedboat to Nusa Penida", detail: "45 min crossing", icon: Plane, tag: "Adventure" },
        { time: "10:00", title: "Kelingking Beach viewpoint", detail: "Cliffside T-rex shaped bay", icon: Camera, tag: "Photo" },
        { time: "15:00", title: "Snorkel with manta rays", detail: "Crystal Bay · gear included", icon: Mountain, tag: "Adventure" },
      ],
    },
    {
      day: "Day 4",
      title: "Foodie & wellness",
      items: [
        { time: "09:00", title: "Balinese cooking class", detail: "Make 5 dishes from scratch", icon: Utensils, tag: "Foodie" },
        { time: "14:00", title: "Spa & flower bath", detail: "90 min full ritual", icon: Heart, tag: "Wellness" },
        { time: "19:00", title: "Beach club sunset", detail: "Live DJ · craft cocktails", icon: Sun, tag: "Chill" },
      ],
    },
    {
      day: "Day 5",
      title: "Hidden gems",
      items: [
        { time: "08:30", title: "Tibumana waterfall", detail: "Off-the-beaten-path swim spot", icon: Mountain, tag: "Nature" },
        { time: "13:00", title: "Local warung lunch", detail: "Family-run · authentic flavors", icon: Utensils, tag: "Foodie" },
        { time: "18:00", title: "Tanah Lot temple sunset", detail: "Sea temple silhouette", icon: Camera, tag: "Photo" },
      ],
    },
    {
      day: "Day 6",
      title: "Free day & departure",
      items: [
        { time: "10:00", title: "Last-minute shopping", detail: "Seminyak boutiques", icon: Coffee, tag: "Chill" },
        { time: "13:00", title: "Farewell brunch", detail: "Açaí bowls & flat whites", icon: Utensils, tag: "Foodie" },
        { time: "16:00", title: "Airport transfer", detail: "Private car · 45 min", icon: Plane, tag: "Travel" },
      ],
    },
  ];
  return templates.slice(0, Math.max(1, Math.min(days, 6)));
};

const Planner = () => {
  const [destination, setDestination] = useState("Bali, Indonesia");
  const [budget, setBudget] = useState([1200]);
  const [duration, setDuration] = useState(4);
  const [travelType, setTravelType] = useState<string>("adventure");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1400);
  };

  const itinerary = useMemo(() => buildItinerary(destination, duration), [destination, duration]);

  const breakdown = useMemo(() => {
    const total = budget[0];
    return [
      { label: "Stays", value: Math.round(total * 0.42), icon: Hotel, pct: 42 },
      { label: "Food & drinks", value: Math.round(total * 0.22), icon: Utensils, pct: 22 },
      { label: "Activities", value: Math.round(total * 0.20), icon: Mountain, pct: 20 },
      { label: "Transport", value: Math.round(total * 0.16), icon: Plane, pct: 16 },
    ];
  }, [budget]);

  const places = [
    { name: "Tegallalang Rice Terraces", type: "Nature", rating: 4.8 },
    { name: "Sacred Monkey Forest", type: "Wildlife", rating: 4.6 },
    { name: "Nusa Penida Island", type: "Beach", rating: 4.9 },
    { name: "Tanah Lot Temple", type: "Culture", rating: 4.7 },
    { name: "Ubud Art Market", type: "Shopping", rating: 4.4 },
    { name: "Tibumana Waterfall", type: "Hidden gem", rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* Header */}
        <section className="container">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              AI Trip Planner
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Your next trip,
              <br />
              <span className="text-gradient">planned in seconds.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Tell us where, how long and your vibe. Our AI crafts a complete day-by-day itinerary with stays, eats, hidden gems and a smart cost breakdown.
            </p>
          </div>
        </section>

        {/* Planner grid */}
        <section className="container mt-12 grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Input panel */}
          <aside className="lg:sticky lg:top-28 self-start">
            <Card className="rounded-3xl border-border/60 shadow-card overflow-hidden">
              <div className="p-6 border-b border-border/60 gradient-soft">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl gradient-hero shadow-glow">
                    <Wand2 className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <div>
                    <div className="font-display font-semibold">Trip prompt</div>
                    <div className="text-xs text-muted-foreground">Tweak anything · regenerate anytime</div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="dest" className="flex items-center gap-1.5 text-sm font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Destination
                  </Label>
                  <Input
                    id="dest"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Bali, Indonesia"
                    className="rounded-xl h-11"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sampleSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDestination(s)}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary hover:bg-primary/10 hover:text-primary transition-smooth"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 text-sm font-semibold">
                      <Wallet className="h-3.5 w-3.5 text-primary" />
                      Budget per person
                    </Label>
                    <span className="text-sm font-bold text-primary">${budget[0]}</span>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={300}
                    max={5000}
                    step={100}
                    className="py-1"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$300</span>
                    <span>$5,000+</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Duration
                  </Label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={cn(
                          "h-10 rounded-xl text-sm font-semibold transition-smooth border",
                          duration === d
                            ? "bg-primary text-primary-foreground border-primary shadow-glow"
                            : "bg-background border-border hover:border-primary/40 hover:text-primary"
                        )}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-semibold">
                    <Compass className="h-3.5 w-3.5 text-primary" />
                    Travel type
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {travelTypes.map((t) => {
                      const active = travelType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTravelType(t.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-smooth",
                            active
                              ? "bg-primary/10 border-primary/40 text-primary shadow-soft"
                              : "bg-background border-border hover:border-primary/30"
                          )}
                        >
                          <t.icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full rounded-xl"
                  onClick={handleGenerate}
                  disabled={loading || !destination.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating itinerary…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate trip
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Powered by TravelBuddy AI · Avg 2.4s
                </p>
              </div>
            </Card>
          </aside>

          {/* Output panel */}
          <div className="space-y-6">
            {!generated && !loading && <EmptyState onTry={handleGenerate} />}

            {loading && <LoadingState />}

            {generated && !loading && (
              <>
                {/* Summary header */}
                <Card className="rounded-3xl border-border/60 shadow-card overflow-hidden">
                  <div className="p-6 sm:p-7 gradient-mesh relative">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <Button variant="glass" size="sm" className="rounded-xl">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Regenerate
                      </Button>
                      <Button variant="glass" size="sm" className="rounded-xl">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="glass" size="sm" className="rounded-xl">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      AI generated · 2.4s
                    </div>
                    <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      {duration}-day {travelTypes.find((t) => t.id === travelType)?.label.toLowerCase()} trip · {destination}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                      A balanced mix of icon spots, hidden gems and downtime — optimized routes between activities so you spend less time in transit.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        `${duration} days`,
                        `$${budget[0]} / person`,
                        travelTypes.find((t) => t.id === travelType)?.label || "",
                        "Editable",
                        "Buddy-ready",
                      ].map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1 rounded-full bg-card/70 backdrop-blur text-xs font-semibold text-foreground/80 border border-border/40"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Itinerary */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-bold tracking-tight">Day-by-day itinerary</h3>
                    <span className="text-xs text-muted-foreground">{itinerary.length} days planned</span>
                  </div>
                  <div className="space-y-4">
                    {itinerary.map((d, i) => (
                      <Card key={d.day} className="rounded-3xl border-border/60 shadow-card overflow-hidden hover:shadow-elevated transition-smooth">
                        <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between bg-secondary/30">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl gradient-hero text-primary-foreground font-bold text-sm shadow-glow">
                              {i + 1}
                            </span>
                            <div>
                              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {d.day}
                              </div>
                              <div className="font-display font-semibold text-base">{d.title}</div>
                            </div>
                          </div>
                          <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {d.items.length} activities
                          </span>
                        </div>
                        <ul className="divide-y divide-border/60">
                          {d.items.map((it, idx) => (
                            <li
                              key={idx}
                              className="p-4 sm:p-5 flex items-start gap-4 hover:bg-secondary/40 transition-smooth"
                            >
                              <div className="text-xs font-bold text-primary w-12 shrink-0 pt-1">{it.time}</div>
                              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                                <it.icon className="h-4 w-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-foreground">{it.title}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{it.detail}</div>
                              </div>
                              <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-secondary text-[11px] font-medium text-foreground/70">
                                {it.tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Places & Cost */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Places */}
                  <Card className="rounded-3xl border-border/60 shadow-card overflow-hidden">
                    <div className="p-5 border-b border-border/60 flex items-center justify-between">
                      <h3 className="font-display font-semibold">Recommended places</h3>
                      <span className="text-xs text-muted-foreground">{places.length} spots</span>
                    </div>
                    <ul className="divide-y divide-border/60">
                      {places.map((p) => (
                        <li
                          key={p.name}
                          className="p-4 flex items-center gap-3 hover:bg-secondary/40 transition-smooth"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent shrink-0">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.type}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            {p.rating}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Cost breakdown */}
                  <Card className="rounded-3xl border-border/60 shadow-card overflow-hidden">
                    <div className="p-5 border-b border-border/60">
                      <h3 className="font-display font-semibold">Estimated cost</h3>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-display text-3xl font-bold text-gradient">${budget[0]}</span>
                        <span className="text-xs text-muted-foreground">per person · all-in</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {breakdown.map((b) => (
                        <div key={b.label}>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <b.icon className="h-3.5 w-3.5 text-primary" />
                              <span className="font-medium">{b.label}</span>
                            </div>
                            <span className="font-semibold tabular-nums">${b.value}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full gradient-hero rounded-full transition-all duration-500"
                              style={{ width: `${b.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 mt-2 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <span className="text-xs font-semibold text-primary">High · based on 2.3k trips</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* CTA row */}
                <Card className="rounded-3xl border-border/60 shadow-card p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 gradient-soft">
                  <div>
                    <div className="font-display text-lg font-bold">Love this plan?</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Save it, invite buddies, or open the booking flow.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-xl">
                      <Heart className="h-4 w-4" /> Save trip
                    </Button>
                    <Button variant="hero" className="rounded-xl">
                      <Plane className="h-4 w-4" /> Book this trip
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const EmptyState = ({ onTry }: { onTry: () => void }) => (
  <Card className="rounded-3xl border-dashed border-border/80 bg-secondary/30 p-10 sm:p-14 text-center">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-hero shadow-glow">
      <Sparkles className="h-6 w-6 text-primary-foreground" />
    </div>
    <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Ready when you are</h3>
    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
      Fill in your destination and vibe on the left, then hit generate. Your full itinerary, places and cost breakdown will appear right here.
    </p>
    <Button variant="hero" className="mt-6 rounded-xl" onClick={onTry}>
      <Wand2 className="h-4 w-4" />
      Try a sample trip
    </Button>
  </Card>
);

const LoadingState = () => (
  <Card className="rounded-3xl border-border/60 shadow-card p-10 sm:p-14 text-center">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-hero shadow-glow">
      <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
    </div>
    <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Crafting your trip…</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Analyzing 2,300+ similar itineraries, optimizing routes and matching your vibe.
    </p>
    <div className="mt-6 max-w-sm mx-auto space-y-2.5">
      {["Picking destinations", "Optimizing day routes", "Estimating costs"].map((s, i) => (
        <div key={s} className="flex items-center gap-3 text-sm text-foreground/80">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i === 0 ? "bg-primary animate-pulse" : "bg-border"
            )}
          />
          {s}
        </div>
      ))}
    </div>
  </Card>
);

export default Planner;
