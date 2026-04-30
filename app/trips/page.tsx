"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Clock, Wallet, Plus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { Footer } from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Trip = {
  id: string;
  destination: string;
  days: string;
  budget: string;
  created_at: string;
  plan?: any;
};

const getImage = (destination: string) =>
  `https://picsum.photos/seed/${destination.replace(/\s/g, "")}/800/500`;

export default function TripsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchTrips();
  }, [user?.id]);

  async function fetchTrips() {
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setTrips(data ?? []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-24 container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">Your Trips ✈️</h1>
            <p className="mt-1 text-muted-foreground text-sm">{trips.length} trip{trips.length !== 1 && "s"} planned</p>
          </div>
          <Button variant="hero" className="rounded-xl shadow-glow" onClick={() => router.push("/plan-trip")}>
            <Plus className="h-4 w-4" /> Plan New Trip
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="text-center py-24 rounded-3xl border border-dashed border-border">
            <p className="text-2xl font-semibold">No trips yet 😔</p>
            <p className="text-muted-foreground mt-2 mb-6">Start planning your first AI-powered trip!</p>
            <Button variant="hero" className="rounded-xl shadow-glow" onClick={() => router.push("/plan-trip")}>
              Plan Trip ✨
            </Button>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} onClick={() => router.push(`/trips/${trip.id}`)}
                className="cursor-pointer group rounded-3xl overflow-hidden border border-border/60 bg-card shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth">
                <div className="relative h-52 overflow-hidden">
                  <img src={getImage(trip.destination)} alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 text-xs opacity-80 mb-1">
                      <MapPin className="h-3 w-3" /> {trip.destination}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                    View Trip →
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-display font-semibold text-lg">{trip.destination}</h2>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {trip.days} days</span>
                    <span className="flex items-center gap-1"><Wallet className="h-4 w-4" /> ₹{Number(trip.budget).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Created {new Date(trip.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}