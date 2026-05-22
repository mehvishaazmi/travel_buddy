"use client";

import { useEffect, useState, useCallback } from "react";

import {
  BadgeCheck,
  Loader2,
  Search,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  city: string;
  bio: string;
  interests: string[];
  avatar_initials: string;
  is_verified: boolean;
  created_at: string;
  tripCount: number;
};

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [actionId, setActionId] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Fetch Users
  // ─────────────────────────────────────────────

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin?section=users&page=${p}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const json = await res.json();

      setUsers(json.profiles ?? []);

      setTotal(json.total ?? 0);

    } catch (error) {
      console.error("[ADMIN_USERS]", error);

      toast.error("Failed to load users");

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  // ─────────────────────────────────────────────
  // Verify / Unverify
  // ─────────────────────────────────────────────

  async function toggleVerify(
    userId: string,
    currently: boolean
  ) {
    setActionId(userId);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: currently
            ? "unverify_user"
            : "verify_user",

          targetId: userId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Action failed");
        return;
      }

      toast.success(json.message);

      // Optimistic update
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId
            ? {
                ...u,
                is_verified: !currently,
              }
            : u
        )
      );

    } catch (error) {
      console.error("[VERIFY_USER]", error);

      toast.error("Something went wrong");

    } finally {
      setActionId(null);
    }
  }

  // ─────────────────────────────────────────────
  // Search Filter
  // ─────────────────────────────────────────────

  const filtered = search.trim()
    ? users.filter((u) => {
        const name = (u.name || "")
          .toLowerCase();

        const city = (u.city || "")
          .toLowerCase();

        const query = search.toLowerCase();

        return (
          name.includes(query) ||
          city.includes(query)
        );
      })
    : users;

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-semibold text-white">
            Users
          </h1>

          <p className="mt-0.5 text-sm text-white/30">
            {total} buddy profiles on platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">

        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

        <input
          type="text"
          placeholder="Search by name or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">

        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_80px_80px_100px] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">

          {[
            "User",
            "Location",
            "Trips",
            "Status",
            "Action",
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

        ) : filtered.length === 0 ? (

          <div className="py-16 text-center text-sm text-white/20">
            No users found
          </div>

        ) : (

          <ul className="divide-y divide-white/[0.04]">

            {filtered.map((user) => (
              <li
                key={user.id}
                className="grid grid-cols-[1fr_120px_80px_80px_100px] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
              >

                {/* User */}
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-xs font-semibold text-white/70">

                    {user.avatar_initials ||
                      user.name
                        ?.slice(0, 2)
                        .toUpperCase() ||
                      "U"}
                  </div>

                  <div className="min-w-0">

                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-white">

                      {user.name || "Unknown User"}

                      {user.is_verified && (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      )}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-white/25">
                      {user.bio?.slice(0, 50) || "No bio"}
                    </p>
                  </div>
                </div>

                {/* City */}
                <div className="flex min-w-0 items-center gap-1.5 text-xs text-white/35">

                  <MapPin className="h-3 w-3 shrink-0" />

                  <span className="truncate">
                    {user.city || "—"}
                  </span>
                </div>

                {/* Trips */}
                <p className="tabular-nums text-sm text-white/50">
                  {user.tripCount || 0}
                </p>

                {/* Status */}
                <div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      user.is_verified
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/[0.04] text-white/25"
                    )}
                  >
                    {user.is_verified
                      ? "Verified"
                      : "Unverified"}
                  </span>
                </div>

                {/* Action */}
                <button
                  onClick={() =>
                    toggleVerify(
                      user.user_id,
                      user.is_verified
                    )
                  }
                  disabled={actionId === user.user_id}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40",
                    user.is_verified
                      ? "bg-white/[0.04] text-white/40 hover:bg-red-500/10 hover:text-red-400"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  )}
                >

                  {actionId === user.user_id ? (

                    <Loader2 className="h-3 w-3 animate-spin" />

                  ) : user.is_verified ? (

                    <>
                      <ShieldOff className="h-3 w-3" />
                      Unverify
                    </>

                  ) : (

                    <>
                      <ShieldCheck className="h-3 w-3" />
                      Verify
                    </>
                  )}
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
              disabled={page === 1}
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
              disabled={page === totalPages}
              className="rounded-xl border border-white/[0.06] p-2 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}