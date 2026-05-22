"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import {
  MapPin,
  Clock,
  Wallet,
  Users,
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import { toast } from "sonner";

type Trip = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  created_at: string;
  user_id: string;
  invite_code: string;
  memberCount: number;
};

const PAGE_SIZE = 20;

// ─────────────────────────────────────────────
// Delete Modal
// ─────────────────────────────────────────────

function DeleteModal({
  trip,
  onConfirm,
  onCancel,
  loading,
}: {
  trip: Trip;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#141420] p-6 shadow-2xl">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>

          <h2 className="text-base font-semibold text-white">
            Delete trip?
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-white/40">

          This will permanently delete{" "}

          <span className="font-medium text-white">
            {trip.destination}
          </span>{" "}

          along with all its members, expenses,
          and settlements.

          <br />
          <br />

          This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/[0.06] py-2.5 text-sm text-white/50 transition-all hover:bg-white/[0.04] hover:text-white/80 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/80 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-500 disabled:opacity-40"
          >

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [deleteTarget, setDeleteTarget] =
    useState<Trip | null>(null);

  const [deleting, setDeleting] = useState(false);

  const debounceRef =
    useRef<NodeJS.Timeout | null>(null);

  // ─────────────────────────────────────────────
  // Debounce Search
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  // ─────────────────────────────────────────────
  // Fetch Trips
  // ─────────────────────────────────────────────

  const fetchTrips = useCallback(
    async (p: number, q: string) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          section: "trips",
          page: String(p),
          ...(q ? { q } : {}),
        });

        const res = await fetch(
          `/api/admin?${params}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const json = await res.json();

        setTrips(json.trips ?? []);

        setTotal(json.total ?? 0);

      } catch (error) {
        console.error("[ADMIN_TRIPS]", error);

        toast.error("Failed to load trips");

      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTrips(page, debouncedSearch);
  }, [page, debouncedSearch, fetchTrips]);

  // ─────────────────────────────────────────────
  // Delete Trip
  // ─────────────────────────────────────────────

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: "delete_trip",
          targetId: deleteTarget.id,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Delete failed");
        return;
      }

      toast.success(
        `Trip to ${deleteTarget.destination} deleted`
      );

      // Optimistic update
      setTrips((prev) =>
        prev.filter((t) => t.id !== deleteTarget.id)
      );

      setTotal((prev) => Math.max(0, prev - 1));

      setDeleteTarget(null);

    } catch (error) {
      console.error("[DELETE_TRIP]", error);

      toast.error("Something went wrong");

    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  return (
    <>
      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          trip={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <div className="max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-semibold text-white">
              Trips
            </h1>

            <p className="mt-0.5 text-sm text-white/30">
              {total} trips on platform
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">

          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

          <input
            type="text"
            placeholder="Search by destination…"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">

          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_90px_80px] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">

            {[
              "Destination",
              "Days",
              "Budget",
              "Members",
              "",
            ].map((h) => (
              <p
                key={h}
                className="text-xs font-medium uppercase tracking-wider text-white/25"
              >
                {h}
              </p>
            ))}
          </div>

          {/* Loading */}
          {loading ? (

            <div className="flex justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-white/20" />
            </div>

          ) : trips.length === 0 ? (

            <div className="py-16 text-center text-sm text-white/20">

              {debouncedSearch
                ? `No trips matching "${debouncedSearch}"`
                : "No trips yet"}
            </div>

          ) : (

            <ul className="divide-y divide-white/[0.04]">

              {trips.map((trip) => (
                <li
                  key={trip.id}
                  className="group grid grid-cols-[1fr_80px_100px_90px_80px] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >

                  {/* Destination */}
                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">

                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-white">
                        {trip.destination || "Unknown"}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-xs text-white/25">

                        <Clock className="h-2.5 w-2.5" />

                        {new Date(
                          trip.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="flex items-center gap-1 text-sm text-white/50">

                    <Clock className="h-3 w-3 text-white/20" />

                    {trip.days || 0}d
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-1 text-sm text-white/50">

                    <Wallet className="h-3 w-3 text-white/20" />

                    ₹{Number(
                      trip.budget || 0
                    ).toLocaleString("en-IN")}
                  </div>

                  {/* Members */}
                  <div className="flex items-center gap-1 text-sm text-white/50">

                    <Users className="h-3 w-3 text-white/20" />

                    {trip.memberCount || 0}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      setDeleteTarget(trip)
                    }
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/20 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />

                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">

            <p className="text-xs text-white/25">
              Page {page} of {totalPages} · {total} total
            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={page === 1 || loading}
                className="rounded-xl border border-white/[0.06] p-2 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={
                  page === totalPages || loading
                }
                className="rounded-xl border border-white/[0.06] p-2 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}