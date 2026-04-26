"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  MapPin,
  Clock,
  Star,
  ChevronLeft,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

const getImage = (destination: string) =>
  `https://images.unsplash.com/featured/?${destination},travel`;

export default function TripDetailsPage() {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data = await res.json();
        setTrip(data.trip);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ✨ Loading trip details...
      </div>
    );
  }

  // ✅ NOT FOUND
  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Trip not found
      </div>
    );
  }

  const heroImage = getImage(trip.destination);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-20">
        <div className="relative h-[300px] md:h-[420px] overflow-hidden">
          <img
            src={heroImage}
            alt={trip.destination}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">
              {trip.destination}
            </h1>

            <div className="flex gap-6 mt-3 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {trip.destination}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {trip.days} days
              </span>

              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {trip.budget}
              </span>
            </div>
          </div>
        </div>

        <div className="container mt-6">
          <Link href="/trips" className="flex items-center gap-2 text-sm">
            <ChevronLeft /> Back to Trips
          </Link>
        </div>
      </section>

      {/* PLACES */}
      <section className="container mt-10">
        <h2 className="text-2xl font-semibold mb-4">Places</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {trip.plan?.places?.length ? (
            trip.plan.places.map((p: string, i: number) => (
              <div
                key={i}
                className="bg-card p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                {p}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No places available</p>
          )}
        </div>
      </section>

      {/* ITINERARY */}
      <section className="container mt-10">
        <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>

        {trip.plan?.itinerary?.length ? (
          trip.plan.itinerary.map((day: any, i: number) => (
            <div
              key={i}
              className="bg-card p-5 rounded-xl mb-4 shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold">
                Day {day.day}: {day.title}
              </h3>

              <ul className="list-disc pl-5 mt-2">
                {day.activities?.map((a: string, idx: number) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No itinerary available</p>
        )}
      </section>

      {/* BUDGET */}
      <section className="container mt-10">
        <h2 className="text-2xl font-semibold mb-4">Budget</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trip.plan?.budget ? (
            Object.entries(trip.plan.budget).map(([k, v]: any, i) => (
              <div
                key={i}
                className="bg-card p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold capitalize">{k}</p>
                <p className="text-muted-foreground">{v}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No budget data</p>
          )}
        </div>
      </section>

      {/* TIPS */}
      <section className="container mt-10 mb-20">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>

        {trip.plan?.tips?.length ? (
          <ul className="list-disc pl-5">
            {trip.plan.tips.map((tip: string, i: number) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No tips available</p>
        )}
      </section>

      <Footer />
    </div>
  );
}