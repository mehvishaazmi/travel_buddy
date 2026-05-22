"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Map,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Overview = {
  totalTrips: number;
  totalMembers: number;
  totalBuddyProfiles: number;
  totalRevenue: number;
  completedSettlements: number;
  tripsLast7Days: number;

  recentTrips: {
    id: string;
    destination: string;
    budget: number;
    created_at: string;
    user_id: string;
  }[];
};

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  accent: string;
  href?: string;
}) {
  const content = (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-200",
        href &&
          "group cursor-pointer hover:border-white/10 hover:bg-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            accent
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        {href && (
          <ArrowUpRight className="h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
        )}
      </div>

      <div className="mt-4">
        <p className="tabular-nums text-2xl font-semibold text-white">
          {value}
        </p>

        <p className="mt-0.5 text-sm text-white/40">{label}</p>

        {sub && (
          <p className="mt-1 text-xs text-white/25">
            {sub}
          </p>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  async function load(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch("/api/admin?section=overview");

      if (!res.ok) {
        throw new Error("Failed to fetch overview");
      }

      const json = await res.json();

      setData(json);
    } catch (error) {
      console.error("[ADMIN_OVERVIEW]", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-semibold text-white">
            Overview
          </h1>

          <p className="mt-0.5 text-sm text-white/30">
            Platform health at a glance
          </p>
        </div>

        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70 disabled:opacity-50"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5",
              refreshing && "animate-spin"
            )}
          />

          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <StatCard
          label="Total trips"
          value={data?.totalTrips ?? 0}
          sub={`+${data?.tripsLast7Days ?? 0} this week`}
          icon={Map}
          accent="bg-cyan-500/10 text-cyan-400"
          href="/admin/trips"
        />

        <StatCard
          label="Trip members"
          value={data?.totalMembers ?? 0}
          sub="across all trips"
          icon={Users}
          accent="bg-violet-500/10 text-violet-400"
          href="/admin/users"
        />

        <StatCard
          label="Buddy profiles"
          value={data?.totalBuddyProfiles ?? 0}
          sub="on platform"
          icon={TrendingUp}
          accent="bg-emerald-500/10 text-emerald-400"
          href="/admin/users"
        />

        <StatCard
          label="Settled payments"
          value={`₹${Number(
            data?.totalRevenue ?? 0
          ).toLocaleString("en-IN")}`}
          sub={`${data?.completedSettlements ?? 0} settlements`}
          icon={CreditCard}
          accent="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Recent Trips */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">

        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-medium text-white">
            Recent trips
          </h2>

          <Link
            href="/admin/trips"
            className="flex items-center gap-1 text-xs text-white/30 transition-colors hover:text-cyan-400"
          >
            View all

            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {(data?.recentTrips ?? []).length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/20">
            No trips yet
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">

            {(data?.recentTrips ?? []).map((trip) => (
              <li
                key={trip.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {trip.destination}
                  </p>

                  <p className="mt-0.5 text-xs text-white/30">
                    ₹{Number(
                      trip.budget || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 text-xs text-white/25">
                  <Clock className="h-3 w-3" />

                  {new Date(trip.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">

        <Link
          href="/admin/users"
          className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
              <Users className="h-4 w-4 text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Manage users
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                Verify profiles, view members
              </p>
            </div>

            <ArrowUpRight className="ml-auto h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
          </div>
        </Link>

        <Link
          href="/admin/trips"
          className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
              <Map className="h-4 w-4 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Manage trips
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                Browse all trips, delete harmful ones
              </p>
            </div>

            <ArrowUpRight className="ml-auto h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
          </div>
        </Link>
      </div>
    </div>
  );
}