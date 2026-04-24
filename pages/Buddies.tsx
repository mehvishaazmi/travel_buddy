"use client";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  BadgeCheck,
  Heart,
  MessageCircle,
  Send,
  Filter,
  Wallet,
  X,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const ALL_INTERESTS = [
  "Hiking",
  "Photography",
  "Foodie",
  "Surfing",
  "Yoga",
  "Coffee",
  "Art",
  "Nightlife",
  "Slow travel",
  "Backpacking",
  "Diving",
  "Local markets",
];

type Buddy = {
  id: string;
  initials: string;
  name: string;
  age: number;
  city: string;
  destination: string;
  budget: number;
  match: number;
  interests: string[];
  bio: string;
  gradient: string;
};

const buddies: Buddy[] = [
  {
    id: "1",
    initials: "SR",
    name: "Sara Reyes",
    age: 27,
    city: "Lisbon, PT",
    destination: "Bali, Indonesia",
    budget: 1400,
    match: 96,
    interests: ["Hiking", "Photography", "Foodie"],
    bio: "Slow mornings, big sunsets. Looking for a chill crew to explore Ubud rice terraces.",
    gradient: "from-primary to-primary-glow",
  },
  {
    id: "2",
    initials: "JK",
    name: "Jamal Khan",
    age: 31,
    city: "Toronto, CA",
    destination: "Bali, Indonesia",
    budget: 1800,
    match: 92,
    interests: ["Surfing", "Coffee", "Slow travel"],
    bio: "Surf at dawn, café-hop till dusk. Down for Canggu, Uluwatu, and quiet beaches.",
    gradient: "from-accent to-primary",
  },
  {
    id: "3",
    initials: "EN",
    name: "Elif Nazari",
    age: 25,
    city: "Berlin, DE",
    destination: "Lisbon, Portugal",
    budget: 900,
    match: 89,
    interests: ["Yoga", "Art", "Local markets"],
    bio: "Sketchbook in bag, always. Museums, tiny galleries and weekend pastel-de-nata runs.",
    gradient: "from-primary-glow to-accent",
  },
  {
    id: "4",
    initials: "MO",
    name: "Marco Oliveira",
    age: 29,
    city: "São Paulo, BR",
    destination: "Tokyo, Japan",
    budget: 2400,
    match: 88,
    interests: ["Foodie", "Photography", "Nightlife"],
    bio: "Ramen marathons and neon-lit alleys. First-timer energy, second-time itinerary.",
    gradient: "from-primary to-accent",
  },
  {
    id: "5",
    initials: "AK",
    name: "Aiko Kimura",
    age: 26,
    city: "Osaka, JP",
    destination: "Reykjavík, Iceland",
    budget: 2200,
    match: 84,
    interests: ["Hiking", "Photography"],
    bio: "Glaciers, northern lights, hot springs. Quiet pace, steady wonder.",
    gradient: "from-primary-glow to-primary",
  },
  {
    id: "6",
    initials: "LB",
    name: "Lucas Bernard",
    age: 33,
    city: "Paris, FR",
    destination: "Marrakech, Morocco",
    budget: 1100,
    match: 81,
    interests: ["Foodie", "Art", "Local markets"],
    bio: "Souks, riads, and the perfect mint tea. Up for desert detours.",
    gradient: "from-accent to-primary-glow",
  },
];

const Buddies = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<number[]>([2500]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [interests, setInterests] = useState<string[]>([]);
  const [activeBuddy, setActiveBuddy] = useState<Buddy>(buddies[0]);
  const [chatInput, setChatInput] = useState("");

  const toggleInterest = (i: string) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const filtered = useMemo(() => {
    return buddies.filter((b) => {
      if (
        destination &&
        !b.destination.toLowerCase().includes(destination.toLowerCase())
      )
        return false;
      if (b.budget > budget[0]) return false;
      if (
        interests.length &&
        !interests.some((i) => b.interests.includes(i))
      )
        return false;
      return true;
    });
  }, [destination, budget, interests]);

  const Filters = (
    <div className="space-y-7">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Destination
        </Label>
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Anywhere"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-9 h-11 rounded-xl"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Budget
          </Label>
          <span className="text-sm font-semibold text-primary">
            up to ${budget[0]}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
          <Slider
            value={budget}
            onValueChange={setBudget}
            min={500}
            max={5000}
            step={100}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Travel dates
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-2 h-11 rounded-xl justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d")} –{" "}
                    {format(dateRange.to, "MMM d")}
                  </>
                ) : (
                  format(dateRange.from, "PPP")
                )
              ) : (
                <span>Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Interests
        </Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_INTERESTS.map((i) => {
            const active = interests.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-secondary/60 text-foreground/70 border-transparent hover:bg-secondary"
                )}
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>

      {(destination || interests.length > 0 || budget[0] !== 2500) && (
        <Button
          variant="ghost"
          className="w-full rounded-xl text-muted-foreground"
          onClick={() => {
            setDestination("");
            setInterests([]);
            setBudget([2500]);
            setDateRange(undefined);
          }}
        >
          <X className="h-4 w-4" /> Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="container">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Travel buddies
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">
            Find your <span className="text-gradient">perfect travel match</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            Verified profiles, smart compatibility scoring, and real conversations — meet people who travel the way you do.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" /> ID-verified
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" /> AI-matched compatibility
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" /> In-app chat & requests
            </span>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-[280px_1fr_360px] gap-6">
          {/* Filters - desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Filters
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filtered.length} match{filtered.length !== 1 && "es"}
                </span>
              </div>
              {Filters}
            </div>
          </aside>

          {/* Mobile filters */}
          <div className="lg:hidden flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filtered.length} buddies found
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{Filters}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Profile cards */}
          <div className="grid sm:grid-cols-2 gap-5 content-start">
            {filtered.length === 0 && (
              <div className="sm:col-span-2 rounded-3xl border border-dashed border-border p-12 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-3 font-semibold">No matches yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try widening your budget or removing interest filters.
                </p>
              </div>
            )}

            {filtered.map((b) => {
              const isActive = activeBuddy.id === b.id;
              return (
                <article
                  key={b.id}
                  onClick={() => setActiveBuddy(b)}
                  className={cn(
                    "group cursor-pointer rounded-3xl bg-card border p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth",
                    isActive
                      ? "border-primary/60 shadow-card ring-2 ring-primary/20"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "relative h-14 w-14 rounded-2xl bg-gradient-to-br grid place-items-center text-primary-foreground font-bold shadow-glow",
                          b.gradient
                        )}
                      >
                        {b.initials}
                        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card grid place-items-center">
                          <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                        </span>
                      </div>
                      <div>
                        <div className="font-display font-semibold">
                          {b.name},{" "}
                          <span className="text-muted-foreground font-normal">
                            {b.age}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {b.city}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-gradient leading-none">
                        {b.match}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                        match
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-foreground/75 leading-relaxed line-clamp-2">
                    {b.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {b.interests.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-secondary text-[11px] font-medium text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground min-w-0">
                      Heading to{" "}
                      <span className="font-semibold text-foreground">
                        {b.destination}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-smooth"
                        aria-label="Save"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <Button
                        size="sm"
                        variant="hero"
                        className="rounded-xl h-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBuddy(b);
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Chat preview */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="rounded-3xl border border-border/60 bg-card shadow-elevated overflow-hidden">
              <div className="p-5 border-b border-border/60 flex items-center gap-3 gradient-soft">
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl bg-gradient-to-br grid place-items-center text-primary-foreground font-semibold shadow-glow",
                    activeBuddy.gradient
                  )}
                >
                  {activeBuddy.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold flex items-center gap-1.5">
                    {activeBuddy.name}
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Online · {activeBuddy.match}% match
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 bg-gradient-to-b from-background to-secondary/30 min-h-[280px]">
                <div className="flex justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-card px-2.5 py-1 rounded-full border border-border/60">
                    Today
                  </span>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-2.5 text-sm shadow-soft">
                    Hey! Saw we're both heading to{" "}
                    <span className="font-semibold">
                      {activeBuddy.destination.split(",")[0]}
                    </span>{" "}
                    👋
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm gradient-hero text-primary-foreground px-4 py-2.5 text-sm shadow-glow">
                    Yes! Want to plan a day together?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-2.5 text-sm shadow-soft">
                    Down for it. Sunrise hike + café after?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-2.5 shadow-soft inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>

              {/* Trip request card */}
              <div className="px-5 pb-4">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" /> Trip request
                  </div>
                  <div className="mt-1.5 text-sm font-semibold">
                    Join {activeBuddy.name.split(" ")[0]}'s trip to{" "}
                    {activeBuddy.destination.split(",")[0]}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    5 days · up to ${activeBuddy.budget} · 2 spots left
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="hero" className="flex-1 rounded-lg">
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg">
                      Later
                    </Button>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setChatInput("");
                }}
                className="p-3 border-t border-border/60 flex gap-2 bg-card"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Message ${activeBuddy.name.split(" ")[0]}...`}
                  className="rounded-xl h-11 border-border/60"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="icon"
                  className="h-11 w-11 rounded-xl shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buddies;
