"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Trip = {
  id: string;
  destination: string;
  days: string;
  budget: string;
  created_at: string;
  plan: any;
};

// ✅ Better image generator (stable Unsplash)
const getTripMeta = (destination: string) => ({
  country: destination,
  image: `https://images.unsplash.com/featured/?${destination},travel`,
  vibe: "AI Generated",
});

// ✅ Fallback image
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const TripCardSkeleton = () => (
  <div className="rounded-3xl border border-border/60 bg-card overflow-hidden">
    <Skeleton className="aspect-[5/3] w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

const TripCard = ({ t }: { t: Trip }) => {
  const meta = getTripMeta(t.destination);

  return (
    <article className="group overflow-hidden rounded-3xl border bg-card hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
      {/* IMAGE */}
      <div className="relative aspect-[5/3] overflow-hidden">
        <img
          src={meta.image}
          alt={t.destination}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* vibe */}
        <span className="absolute top-3 left-3 bg-white/80 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {meta.vibe}
        </span>

        {/* location */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1 text-xs opacity-90">
            <MapPin className="h-3 w-3" /> {meta.country}
          </div>
          <h3 className="text-xl font-bold">{t.destination}</h3>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/70 p-3 rounded-xl">
            <div className="text-xs flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" /> Days
            </div>
            <div className="font-bold">{t.days}</div>
          </div>

          <div className="bg-secondary/70 p-3 rounded-xl">
            <div className="text-xs flex items-center gap-1 text-muted-foreground">
              <Wallet className="h-3 w-3" /> Budget
            </div>
            <div className="font-bold">{t.budget}</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(t.created_at).toLocaleDateString()}
        </div>

        <Button asChild className="w-full rounded-xl">
          <Link href={`/trips/${t.id}`}>
            View Details
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

const EmptyState = () => (
  <div className="text-center py-20">
    <Compass className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="text-xl font-bold mt-4">No trips yet</h3>
    <p className="text-gray-500 mt-2">Start planning your first trip</p>
  </div>
);

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips");
        const data = await res.json();
        setTrips(data.trips || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HEADER */}
      <section className="pt-28 pb-12 container flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Trips</h1>
        <Button asChild>
          <Link href="/planner">
            <Plus className="h-4 w-4 mr-1" />
            New Trip
          </Link>
        </Button>
      </section>

      {/* CONTENT */}
      <section className="container pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((t) => (
              <TripCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}