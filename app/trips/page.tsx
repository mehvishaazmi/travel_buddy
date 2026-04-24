"use client";

import { useEffect, useState } from "react";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      setTrips(data.trips || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">🌍 Your Trips</h1>

      {loading && <p>Loading trips...</p>}

      {!loading && trips.length === 0 && (
        <p className="text-gray-500">No trips saved yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {trip.destination}
            </h2>

            <p className="text-sm text-gray-500 mb-1">
              {trip.days} days • {trip.budget}
            </p>

            <p className="text-xs text-gray-400 mb-4">
              {new Date(trip.created_at).toLocaleDateString()}
            </p>

            <a
              href={`/trips/${trip.id}`}
              className="text-blue-500 text-sm font-medium"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}