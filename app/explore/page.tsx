"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ArrowUpRight,
  Clock,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

type Trip = {
  id: number;
  img: string;
  location: string;
  title: string;
  rating: number;
  reviews: number;
  duration: number;
  price: number;
  tags: string[];
  type: "Adventure" | "Honeymoon" | "Family" | "Weekend";
  popularity: number;
};

const TRIPS: Trip[] = [
  {
    id: 1,
    img: "/dest-santorini.jpg",
    location: "Santorini, Greece",
    title: "Cliffside Sunsets & Caldera Cruise",
    rating: 4.9,
    reviews: 312,
    duration: 7,
    price: 1240,
    tags: ["Sunsets", "Couples", "Cruise"],
    type: "Honeymoon",
    popularity: 98,
  },
  {
    id: 2,
    img: "/dest-bali.jpg",
    location: "Ubud, Bali",
    title: "Rice Terraces & Wellness Retreat",
    rating: 4.8,
    reviews: 528,
    duration: 9,
    price: 890,
    tags: ["Yoga", "Nature", "Spa"],
    type: "Honeymoon",
    popularity: 95,
  },
  {
    id: 3,
    img: "/dest-tokyo.jpg",
    location: "Tokyo, Japan",
    title: "Neon Nights & Hidden Alleyways",
    rating: 4.9,
    reviews: 421,
    duration: 6,
    price: 1560,
    tags: ["Food", "Culture", "City"],
    type: "Weekend",
    popularity: 92,
  },
  {
    id: 4,
    img: "/dest-swiss.jpg",
    location: "Zermatt, Switzerland",
    title: "Matterhorn Trekking Expedition",
    rating: 4.9,
    reviews: 198,
    duration: 8,
    price: 1820,
    tags: ["Hiking", "Mountains", "Snow"],
    type: "Adventure",
    popularity: 88,
  },
  {
    id: 5,
    img: "/hero-travel.jpg",
    location: "Lisbon, Portugal",
    title: "Coastal Drive & Pastel de Nata Tour",
    rating: 4.7,
    reviews: 264,
    duration: 5,
    price: 760,
    tags: ["Coast", "Food"],
    type: "Weekend",
    popularity: 84,
  },
  {
    id: 6,
    img: "/dest-bali.jpg",
    location: "Canggu, Bali",
    title: "Surf, Sunsets & Beach Clubs",
    rating: 4.6,
    reviews: 392,
    duration: 7,
    price: 980,
    tags: ["Surf", "Beach"],
    type: "Adventure",
    popularity: 81,
  },
  {
    id: 7,
    img: "/dest-santorini.jpg",
    location: "Amalfi Coast, Italy",
    title: "Lemon Groves & Coastal Villages",
    rating: 4.8,
    reviews: 287,
    duration: 6,
    price: 1390,
    tags: ["Coast", "Food", "Romance"],
    type: "Family",
    popularity: 89,
  },
  {
    id: 8,
    img: "/dest-tokyo.jpg",
    location: "Kyoto, Japan",
    title: "Temples, Tea & Bamboo Forests",
    rating: 4.9,
    reviews: 356,
    duration: 5,
    price: 1180,
    tags: ["Culture", "Heritage"],
    type: "Family",
    popularity: 90,
  },
  {
    id: 9,
    img: "/dest-swiss.jpg",
    location: "Banff, Canada",
    title: "Rockies Lake Loop Adventure",
    rating: 4.8,
    reviews: 221,
    duration: 8,
    price: 1670,
    tags: ["Lakes", "Hiking"],
    type: "Adventure",
    popularity: 86,
  },
  {
    id: 10,
    img: "/hero-travel.jpg",
    location: "Marrakech, Morocco",
    title: "Souks, Spices & Sahara Stars",
    rating: 4.7,
    reviews: 189,
    duration: 6,
    price: 920,
    tags: ["Desert", "Culture"],
    type: "Adventure",
    popularity: 78,
  },
  {
    id: 11,
    img: "/dest-bali.jpg",
    location: "Maldives",
    title: "Overwater Villa Honeymoon Escape",
    rating: 5.0,
    reviews: 412,
    duration: 5,
    price: 2480,
    tags: ["Beach", "Luxury"],
    type: "Honeymoon",
    popularity: 96,
  },
  {
    id: 12,
    img: "/dest-santorini.jpg",
    location: "Reykjavik, Iceland",
    title: "Northern Lights & Glacier Trek",
    rating: 4.8,
    reviews: 174,
    duration: 7,
    price: 1740,
    tags: ["Aurora", "Glacier"],
    type: "Adventure",
    popularity: 85,
  },
];

const TYPES = ["Adventure", "Honeymoon", "Family", "Weekend"] as const;
const PAGE_SIZE = 6;

const TripCard = ({ t }: { t: Trip }) => (
  <article className="group card-premium flex flex-col overflow-hidden">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={t.img}
        alt={t.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-80" />
      <span className="glass absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
        <Star className="h-3 w-3 fill-accent text-accent" />
        {t.rating}
        <span className="font-normal text-muted-foreground">({t.reviews})</span>
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-accent/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
        {t.type}
      </span>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-primary-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-xs font-medium drop-shadow">{t.location}</span>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-balance font-display text-lg font-bold leading-snug tracking-tight">
        {t.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {t.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground/80"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {t.duration} days
        </span>
        <span className="text-foreground">
          <span className="text-xs text-muted-foreground">from </span>
          <span className="font-display text-lg font-bold text-foreground">
            ${t.price.toLocaleString()}
          </span>
        </span>
      </div>

      <Link href={`/trips/${t.id}`} className="mt-5">
        <Button variant="default" className="group/btn w-full rounded-xl">
          View Details
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </Button>
      </Link>
    </div>
  </article>
);

type Filters = {
  destination: string;
  budget: [number, number];
  duration: string;
  types: string[];
  minRating: number;
};

const FiltersPanel = ({
  filters,
  setFilters,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
}) => (
  <div className="space-y-7">
    <div>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Destination
      </Label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Where to?"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
          className="rounded-xl pl-9"
        />
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Budget
        </Label>
        <span className="text-xs font-semibold text-foreground">
          ${filters.budget[0]} – ${filters.budget[1]}
        </span>
      </div>
      <Slider
        value={filters.budget}
        min={0}
        max={3000}
        step={50}
        onValueChange={(v) =>
          setFilters({ ...filters, budget: [v[0], v[1]] as [number, number] })
        }
        className="mt-4"
      />
    </div>

    <div>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Duration
      </Label>
      <Select
        value={filters.duration}
        onValueChange={(v) => setFilters({ ...filters, duration: v })}
      >
        <SelectTrigger className="mt-2 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any length</SelectItem>
          <SelectItem value="short">1–4 days</SelectItem>
          <SelectItem value="medium">5–7 days</SelectItem>
          <SelectItem value="long">8+ days</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Travel type
      </Label>
      <div className="mt-3 space-y-2.5">
        {TYPES.map((t) => {
          const checked = filters.types.includes(t);
          return (
            <label
              key={t}
              className="group/chk -mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-smooth hover:bg-secondary/60"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => {
                  const next = c
                    ? [...filters.types, t]
                    : filters.types.filter((x) => x !== t);
                  setFilters({ ...filters, types: next });
                }}
              />
              <span className="text-sm font-medium">{t}</span>
            </label>
          );
        })}
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Minimum rating
        </Label>
        <span className="inline-flex items-center gap-1 text-xs font-semibold">
          <Star className="h-3 w-3 fill-accent text-accent" />
          {filters.minRating.toFixed(1)}+
        </span>
      </div>
      <Slider
        value={[filters.minRating]}
        min={0}
        max={5}
        step={0.1}
        onValueChange={(v) => setFilters({ ...filters, minRating: v[0] })}
        className="mt-4"
      />
    </div>

    <Button variant="outline" className="w-full rounded-xl" onClick={onReset}>
      Reset filters
    </Button>
  </div>
);

const Explore = () => {
  const initial: Filters = {
    destination: "",
    budget: [0, 3000],
    duration: "any",
    types: [],
    minRating: 0,
  };

  const [filters, setFilters] = useState<Filters>(initial);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = TRIPS.filter((t) => {
      if (
        filters.destination &&
        !t.location.toLowerCase().includes(filters.destination.toLowerCase())
      )
        return false;
      if (t.price < filters.budget[0] || t.price > filters.budget[1]) return false;
      if (filters.duration === "short" && t.duration > 4) return false;
      if (filters.duration === "medium" && (t.duration < 5 || t.duration > 7))
        return false;
      if (filters.duration === "long" && t.duration < 8) return false;
      if (filters.types.length && !filters.types.includes(t.type)) return false;
      if (t.rating < filters.minRating) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.popularity - a.popularity);

    return list;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const reset = () => {
    setFilters(initial);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-40">
        <div className="absolute inset-0 gradient-mesh opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Explore trips
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Find your next <span className="text-gradient">unforgettable trip</span>
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Curated, traveler-loved itineraries across every budget and vibe. Filter by destination,
              duration, or style — then book with friends.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-base font-bold">Filters</h2>
                </div>
                <FiltersPanel
                  filters={filters}
                  setFilters={(f) => {
                    setFilters(f);
                    setPage(1);
                  }}
                  onReset={reset}
                />
              </div>
            </aside>

            <main>
              <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> trips found
                </p>
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl lg:hidden">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[320px] overflow-y-auto sm:w-[380px]">
                      <SheetHeader>
                        <SheetTitle className="font-display">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersPanel
                          filters={filters}
                          setFilters={(f) => {
                            setFilters(f);
                            setPage(1);
                          }}
                          onReset={reset}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most popular</SelectItem>
                      <SelectItem value="price-asc">Price: low to high</SelectItem>
                      <SelectItem value="rating">Top rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {pageSlice.length ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pageSlice.map((t) => (
                    <TripCard key={t.id} t={t} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
                  <h3 className="font-display text-xl font-bold">
                    No trips match those filters
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Try widening your budget or clearing some filters.
                  </p>
                  <Button variant="outline" className="mt-5 rounded-xl" onClick={reset}>
                    Reset filters
                  </Button>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(Math.max(1, currentPage - 1));
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(Math.min(totalPages, currentPage + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Explore;