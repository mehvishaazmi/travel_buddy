"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Wallet, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DayPlan = { day: number; title: string; activities: string[] };
type TripPlan = { itinerary: DayPlan[]; budget: Record<string, string>; tips?: string[]; places?: string[] };

type Trip = {
  id: string;
  destination: string;
  days: string;
  budget: string;
  created_at: string;
  plan: TripPlan;
};

const getImage = (destination: string) =>
  `https://picsum.photos/seed/${destination.replace(/\s/g, "")}/1200/600`;

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || !user?.id) return;
    fetchTrip();
  }, [id, user?.id]);

  async function fetchTrip() {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (error || !data) { setNotFound(true); }
    else { setTrip(data); }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (notFound || !trip) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-semibold">Trip not found</p>
      <Button variant="hero" onClick={() => router.push("/trips")}>Back to Trips</Button>
    </div>
  );

  const plan: TripPlan = typeof trip.plan === "string" ? JSON.parse(trip.plan) : trip.plan;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <img src={getImage(trip.destination)} alt={trip.destination}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button onClick={() => router.back()}
          className="absolute top-28 left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/30 transition text-sm">
          ← Back
        </button>
        <div className="absolute bottom-8 left-0 right-0 container">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <MapPin className="h-4 w-4" /> {trip.destination}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
            {trip.destination}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {trip.days} days</span>
            <span className="flex items-center gap-1"><Wallet className="h-4 w-4" /> ₹{Number(trip.budget).toLocaleString()}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />
              {new Date(trip.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className="container pb-24 pt-8 space-y-8">
        <div className="flex gap-3 justify-end">
          <Button variant="hero" className="rounded-xl shadow-glow" onClick={() => router.push(`/my-trips/${trip.id}`)}>
            🚀 Start Trip
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => router.push("/buddies")}>
            👥 Find Buddies
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Duration", value: `${trip.days} days` },
            { label: "Budget", value: `₹${Number(trip.budget).toLocaleString()}` },
            { label: "Daily avg", value: `₹${Math.round(Number(trip.budget) / Number(trip.days)).toLocaleString()}` },
            { label: "Created", value: new Date(trip.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-soft">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="font-display font-bold text-xl mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        {(plan?.itinerary ?? []).length > 0 && (
          <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60">
              <h2 className="font-display text-xl font-semibold">📅 Day-by-day itinerary</h2>
            </div>
            <div className="divide-y divide-border/60">
              {(plan.itinerary ?? []).map((day) => (
                <div key={day.day} className="p-5 hover:bg-secondary/20 transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-bold grid place-items-center shrink-0">
                      {day.day}
                    </span>
                    <h3 className="font-semibold">Day {day.day} — {day.title}</h3>
                  </div>
                  <ul className="space-y-1.5 pl-11">
                    {day.activities.map((a, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground/75">
                        <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget breakdown */}
        {plan?.budget && (
          <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60">
              <h2 className="font-display text-xl font-semibold">💰 Budget breakdown</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
              {Object.entries(plan.budget).map(([key, value]) => (
                <div key={key} className="rounded-2xl bg-secondary/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  <p className="font-display font-bold text-lg mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {(plan?.tips ?? []).length > 0 && ( 
          <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60">
              <h2 className="font-display text-xl font-semibold">💡 Travel tips</h2>
            </div>
            <ul className="p-5 grid sm:grid-cols-2 gap-3">
              {(plan.tips ?? []).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-primary mt-0.5">✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}