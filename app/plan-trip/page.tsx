"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { Loader2, MapPin, Clock, Wallet, ChevronRight, Sparkles } from "lucide-react";

type DayPlan = { day: number; title: string; activities: string[] };
type TripPlan = { itinerary: DayPlan[]; budget: Record<string, string>; tips?: string[]; places?: string[] };

export default function PlanTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);

  async function generateTrip() {
    if (!destination.trim()) return;
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, budget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function saveTrip() {
    if (!plan) return;
    setSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, budget, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/trips/${data.trip.id}`);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-mesh)" }} />
        <div className="container max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            AI Trip Planner
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Plan your trip with <span className="text-gradient">AI ✨</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us where you want to go and we'll build a full itinerary instantly.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-3xl space-y-6">

          {/* Input card */}
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft space-y-5">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Destination
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="e.g. Goa, Manali, Bali..." value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-9 h-12 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Number of days
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" value={days} min={1} max={30}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="pl-9 h-12 rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Budget (₹)
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" value={budget} min={500}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="pl-9 h-12 rounded-xl" />
                </div>
              </div>
            </div>
            <Button variant="hero" className="w-full h-12 rounded-xl shadow-glow text-base"
              onClick={generateTrip} disabled={loading || !destination.trim()}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate Plan</>}
            </Button>
          </div>

          {/* Result */}
          {plan && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Your plan for {destination}</h2>
                <Button variant="hero" className="rounded-xl shadow-glow" onClick={saveTrip} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "💾 Save Trip"}
                </Button>
              </div>

              {/* Itinerary */}
              <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
                <div className="p-5 border-b border-border/60">
                  <h3 className="font-display font-semibold text-lg">📅 Itinerary</h3>
                </div>
                <div className="divide-y divide-border/60">
                  {plan.itinerary.map((day) => (
                    <div key={day.day} className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-bold grid place-items-center shrink-0">
                          {day.day}
                        </span>
                        <h4 className="font-semibold">Day {day.day} — {day.title}</h4>
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

              {/* Budget */}
              <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
                <div className="p-5 border-b border-border/60">
                  <h3 className="font-display font-semibold text-lg">💰 Budget breakdown</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5">
                  {Object.entries(plan.budget).map(([key, value]) => (
                    <div key={key} className="rounded-2xl bg-secondary/50 p-4 text-center">
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      <p className="font-display font-bold text-xl mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {plan.tips && (
                <div className="rounded-3xl border border-border/60 bg-card shadow-soft overflow-hidden">
                  <div className="p-5 border-b border-border/60">
                    <h3 className="font-display font-semibold text-lg">💡 Tips</h3>
                  </div>
                  <ul className="p-5 grid sm:grid-cols-2 gap-3">
                    {plan.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <span className="text-primary mt-0.5">✓</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}