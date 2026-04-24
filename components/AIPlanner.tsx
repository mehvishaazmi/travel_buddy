"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export const AIPlanner = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // ✅ Load session once
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }
    };

    getSession();
  }, []);

  const handleGenerate = async () => {
  if (!destination || !days || !budget) {
    setError("Please fill all fields");
    return;
  }

  setError("");
  setLoading(true);
  setPlan(null);

  try {
    // ✅ ALWAYS get fresh session here
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    // 🔹 1. Generate AI plan (always)
    const res = await fetch("/api/ai/plan-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination,
        days,
        budget,
      }),
    });

    const data = await res.json();

    if (!data.plan) {
      setError("Failed to generate plan. Try again.");
      setLoading(false);
      return;
    }

    setPlan(data.plan);

    // 🔹 2. Save ONLY if user exists
    if (!user) {
      console.warn("User not logged in → skipping save");
    } else {
      const saveRes = await fetch("/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          destination,
          days,
          budget,
          plan: data.plan,
        }),
      });

      const saveData = await saveRes.json();
      console.log("SAVE RESPONSE:", saveData);
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Check API.");
  }

  setLoading(false);
};
  return (
    <section className="py-24 sm:py-32 gradient-soft">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            AI Trip Planner
          </span>

          <h2 className="mt-4 text-4xl font-bold">Plan your trip with AI ✨</h2>
        </div>

        {/* Input */}
        <div className="bg-card border rounded-2xl p-6 space-y-4 shadow">
          <input
            placeholder="Destination (e.g. Bali)"
            className="w-full p-3 border rounded-lg"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            placeholder="Days (e.g. 4)"
            className="w-full p-3 border rounded-lg"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />

          <input
            placeholder="Budget (e.g. low / mid / luxury)"
            className="w-full p-3 border rounded-lg"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={loading}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {loading ? "Generating..." : "Generate Plan"}
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        {/* OUTPUT */}
        <div className="mt-10">
          {/* Loading */}
          {loading && (
            <div className="text-center mt-6">
              <p className="text-lg font-semibold">
                Generating your trip... 🤖
              </p>
              <p className="text-sm text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          )}

          {/* Empty */}
          {!plan && !loading && !error && (
            <p className="text-center text-muted-foreground mt-6">
              Generate a plan to see your itinerary ✨
            </p>
          )}

          {/* RESULT */}
          {plan && (
            <div className="space-y-10 mt-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-3xl">
              {/* 📅 Itinerary */}
              <div>
                <h2 className="text-xl font-bold mb-4">📅 Itinerary</h2>

                {plan.itinerary?.map((day: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border bg-white shadow-sm mb-4"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Day {day.day} — {day.title}
                    </h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                      {(day.activities || []).map((act: string, i: number) => (
                        <li key={i}>• {act}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 💰 Budget */}
              <div>
                <h2 className="text-xl font-bold mb-4">💰 Budget</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(plan.budget || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl border bg-white text-center"
                    >
                      <h3 className="font-semibold capitalize text-sm text-gray-500">
                        {key}
                      </h3>
                      <p className="text-lg font-bold mt-1">
                        {value as string}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📍 Places */}
              <div>
                <h2 className="text-xl font-bold mb-4">📍 Places</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(plan.places || []).map((place: string, i: number) => (
                    <div key={i} className="p-4 rounded-xl border bg-white">
                      📍 {place}
                    </div>
                  ))}
                </div>
              </div>

              {/* ✈️ Tips */}
              <div className="p-6 rounded-2xl bg-yellow-50 border">
                <h2 className="font-bold text-lg mb-3">✈️ Travel Tips</h2>

                <ul className="space-y-2 text-sm">
                  {(plan.tips || []).map((tip: string, i: number) => (
                    <li key={i}>💡 {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
