"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  BadgeCheck,
  Heart,
  MessageCircle,
  Send,
  Filter,
  Wallet,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import type { DateRange } from "react-day-picker";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const ALL_INTERESTS = [
  "Hiking",
  "Photography",
  "Foodie",
  "Surfing",
  "Yoga",
  "Coffee",
  "Art",
  "Nightlife",
  "Slow travel",
  "Backpacking",
  "Diving",
  "Local markets",
];

const GRADIENTS = [
  "from-primary to-primary-glow",
  "from-accent to-primary",
  "from-primary-glow to-accent",
  "from-primary to-accent",
  "from-primary-glow to-primary",
  "from-accent to-primary-glow",
];

type BuddyProfile = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  avatar_initials: string;
  gradient: string;
  is_verified: boolean;
};

type Trip = {
  id: string;
  user_id: string;
  destination: string;
  days: string;
  budget: string;
};

type BuddyWithTrip = BuddyProfile & {
  trip?: Trip;
  match: number;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

// Deterministic match score based on shared interests
// Replace calcMatch function:
function calcMatch(myInterests: string[], theirInterests: string[]): number {
  if (!myInterests.length && !theirInterests.length) return 75;
  const shared = myInterests.filter((i) => theirInterests.includes(i)).length;
  const base = 70;
  const bonus = Math.min(shared * 8, 28);
  return base + bonus; // removed Math.random()
}

export default function Buddies() {
  const { user } = useUser();
  const currentUserId = user?.id ?? "guest";

  // Filter state
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<number[]>([15000]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [interests, setInterests] = useState<string[]>([]);

  // Data state
  const [buddies, setBuddies] = useState<BuddyWithTrip[]>([]);
  const [activeBuddy, setActiveBuddy] = useState<BuddyWithTrip | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [tripRequests, setTripRequests] = useState<Record<string, string>>({}); // tripId -> status
  const [myProfile, setMyProfile] = useState<BuddyProfile | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // ── Fetch everything on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, [currentUserId]);

  async function fetchAll() {
    setLoading(true);
    try {
      await Promise.all([
        fetchBuddies(),
        fetchSaved(),
        fetchTripRequests(),
        fetchMyProfile(),
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyProfile() {
    const { data } = await supabase
      .from("buddy_profiles")
      .select("*")
      .eq("user_id", currentUserId)
      .single();
    if (data) setMyProfile(data);
  }

  async function fetchBuddies() {
    // Get all buddy profiles except current user
    const { data: profiles } = await supabase
      .from("buddy_profiles")
      .select("*")
      .neq("user_id", currentUserId);

    // Get all trips
    const { data: trips } = await supabase
      .from("trips")
      .select("id, user_id, destination, days, budget");

    const tripsByUser: Record<string, Trip> = {};
    (trips ?? []).forEach((t: Trip) => {
      tripsByUser[t.user_id] = t;
    });

    const myInterests = myProfile?.interests ?? [];

    const merged: BuddyWithTrip[] = (profiles ?? []).map((p: BuddyProfile) => ({
      ...p,
      trip: tripsByUser[p.user_id],
      match: calcMatch(myInterests, p.interests ?? []),
    }));

    // Sort by match desc
    merged.sort((a, b) => b.match - a.match);
    setBuddies(merged);
    if (merged.length > 0) setActiveBuddy(merged[0]);
  }

  async function fetchSaved() {
    const { data } = await supabase
      .from("saved_buddies")
      .select("saved_user_id")
      .eq("saver_user_id", currentUserId);
    setSavedIds(new Set((data ?? []).map((r: any) => r.saved_user_id)));
  }

  async function fetchTripRequests() {
    const { data } = await supabase
      .from("trip_requests")
      .select("trip_id, status")
      .eq("requester_user_id", currentUserId);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: any) => {
      map[r.trip_id] = r.status;
    });
    setTripRequests(map);
  }

  // ── Fetch messages when active buddy changes ───────────────────────────────
  useEffect(() => {
    if (!activeBuddy) return;
    fetchMessages(activeBuddy.user_id);

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${activeBuddy.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeBuddy?.user_id]);

  async function fetchMessages(buddyUserId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${buddyUserId}),` +
          `and(sender_id.eq.${buddyUserId},receiver_id.eq.${currentUserId})`,
      )
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async function toggleSave(buddy: BuddyWithTrip, e: React.MouseEvent) {
    e.stopPropagation();
    setSavingId(buddy.user_id);
    const isSaved = savedIds.has(buddy.user_id);
    if (isSaved) {
      await supabase
        .from("saved_buddies")
        .delete()
        .eq("saver_user_id", currentUserId)
        .eq("saved_user_id", buddy.user_id);
      setSavedIds((prev) => {
        const s = new Set(prev);
        s.delete(buddy.user_id);
        return s;
      });
    } else {
      await supabase
        .from("saved_buddies")
        .insert({ saver_user_id: currentUserId, saved_user_id: buddy.user_id });
      setSavedIds((prev) => new Set([...prev, buddy.user_id]));
    }
    setSavingId(null);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || !activeBuddy) return;
    setSendingMsg(true);
    const msg = {
      sender_id: currentUserId,
      receiver_id: activeBuddy.user_id,
      content: chatInput.trim(),
    };
    const { data } = await supabase
      .from("messages")
      .insert(msg)
      .select()
      .single();
    if (data) setMessages((prev) => [...prev, data]);
    setChatInput("");
    setSendingMsg(false);
  }

  async function handleTripRequest(
    action: "accepted" | "declined",
    tripId: string,
  ) {
    if (!activeBuddy || !tripId) return;
    const existing = tripRequests[tripId];

    if (existing) {
      await supabase
        .from("trip_requests")
        .update({ status: action })
        .eq("trip_id", tripId)
        .eq("requester_user_id", currentUserId);
    } else {
      await supabase.from("trip_requests").insert({
        trip_id: tripId,
        requester_user_id: currentUserId,
        owner_user_id: activeBuddy.user_id,
        status: action,
      });
    }
    setTripRequests((prev) => ({ ...prev, [tripId]: action }));
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const toggleInterest = (i: string) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  const filtered = useMemo(() => {
    return buddies.filter((b) => {
      if (
        destination &&
        !b.trip?.destination.toLowerCase().includes(destination.toLowerCase())
      )
        return false;
      if (b.trip && budget[0] < 15000 && Number(b.trip.budget) > budget[0])
        return false;
      if (interests.length && !interests.some((i) => b.interests?.includes(i)))
        return false;
      return true;
    });
  }, [buddies, destination, budget, interests]);

  // ── Render helpers ─────────────────────────────────────────────────────────
  const Filters = (
    <div className="space-y-7">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Destination
        </Label>
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Anywhere"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-9 h-11 rounded-xl"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Budget
          </Label>
          <span className="text-sm font-semibold text-primary">
            up to ₹{budget[0].toLocaleString()}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
          <Slider
            value={budget}
            onValueChange={setBudget}
            min={500}
            max={15000}
            step={500}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Travel dates
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-2 h-11 rounded-xl justify-start text-left font-normal",
                !dateRange && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d")} –{" "}
                    {format(dateRange.to, "MMM d")}
                  </>
                ) : (
                  format(dateRange.from, "PPP")
                )
              ) : (
                <span>Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Interests
        </Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_INTERESTS.map((i) => {
            const active = interests.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-secondary/60 text-foreground/70 border-transparent hover:bg-secondary",
                )}
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>

      {(destination || interests.length > 0 || budget[0] !== 3000) && (
        <Button
          variant="ghost"
          className="w-full rounded-xl text-muted-foreground"
          onClick={() => {
            setDestination("");
            setInterests([]);
            setBudget([5000]);
            setDateRange(undefined);
          }}
        >
          <X className="h-4 w-4" /> Clear filters
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="container">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Travel buddies
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">
            Find your{" "}
            <span className="text-gradient">perfect travel match</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            Verified profiles, smart compatibility scoring, and real
            conversations — meet people who travel the way you do.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" /> ID-verified
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" /> AI-matched
              compatibility
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" /> In-app chat &
              requests
            </span>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-[280px_1fr_360px] gap-6">
          {/* Filters sidebar - desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Filters
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filtered.length} match{filtered.length !== 1 && "es"}
                </span>
              </div>
              {Filters}
            </div>
          </aside>

          {/* Mobile filters */}
          <div className="lg:hidden flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filtered.length} buddies found
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{Filters}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Buddy cards */}
          <div className="grid sm:grid-cols-2 gap-5 content-start">
            {filtered.length === 0 && (
              <div className="sm:col-span-2 rounded-3xl border border-dashed border-border p-12 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-3 font-semibold">No matches yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try widening your budget or removing interest filters.
                </p>
              </div>
            )}

            {filtered.map((b) => {
              const isActive = activeBuddy?.id === b.id;
              const isSaved = savedIds.has(b.user_id);
              const tripStatus = b.trip ? tripRequests[b.trip.id] : undefined;

              return (
                <article
                  key={b.id}
                  onClick={() => {
                    setActiveBuddy(b);
                    fetchMessages(b.user_id);
                  }}
                  className={cn(
                    "group cursor-pointer rounded-3xl bg-card border p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth",
                    isActive
                      ? "border-primary/60 shadow-card ring-2 ring-primary/20"
                      : "border-border/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "relative h-14 w-14 rounded-2xl bg-gradient-to-br grid place-items-center text-primary-foreground font-bold shadow-glow",
                          b.gradient,
                        )}
                      >
                        {b.avatar_initials}
                        {b.is_verified && (
                          <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card grid place-items-center">
                            <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-display font-semibold">
                          {b.name},{" "}
                          <span className="text-muted-foreground font-normal">
                            {b.age}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {b.city}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-gradient leading-none">
                        {b.match}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                        match
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-foreground/75 leading-relaxed line-clamp-2">
                    {b.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(b.interests ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-secondary text-[11px] font-medium text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground min-w-0">
                      {b.trip ? (
                        <>
                          Heading to{" "}
                          <span className="font-semibold text-foreground">
                            {b.trip.destination}
                          </span>
                        </>
                      ) : (
                        <span className="italic">No trip planned yet</span>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={(e) => toggleSave(b, e)}
                        disabled={savingId === b.user_id}
                        className={cn(
                          "h-9 w-9 grid place-items-center rounded-xl transition-smooth",
                          isSaved
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary hover:bg-accent hover:text-accent-foreground",
                        )}
                        aria-label={isSaved ? "Unsave" : "Save"}
                      >
                        <Heart
                          className={cn("h-4 w-4", isSaved && "fill-current")}
                        />
                      </button>
                      <Button
                        size="sm"
                        variant="hero"
                        className="rounded-xl h-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBuddy(b);
                          fetchMessages(b.user_id);
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>

                  {/* Trip request status badge */}
                  {tripStatus && (
                    <div
                      className={cn(
                        "mt-3 text-[11px] font-semibold px-3 py-1 rounded-full w-fit",
                        tripStatus === "accepted"
                          ? "bg-green-500/10 text-green-500"
                          : tripStatus === "declined"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-600",
                      )}
                    >
                      Trip request: {tripStatus}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Chat panel */}
          {activeBuddy && (
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-3xl border border-border/60 bg-card shadow-elevated overflow-hidden">
                {/* Chat header */}
                <div className="p-5 border-b border-border/60 flex items-center gap-3 gradient-soft">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-xl bg-gradient-to-br grid place-items-center text-primary-foreground font-semibold shadow-glow",
                      activeBuddy.gradient,
                    )}
                  >
                    {activeBuddy.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold flex items-center gap-1.5">
                      {activeBuddy.name}
                      {activeBuddy.is_verified && (
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      Online · {activeBuddy.match}% match
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-5 space-y-3 bg-gradient-to-b from-background to-secondary/30 min-h-[280px] max-h-[320px] overflow-y-auto">
                  <div className="flex justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-card px-2.5 py-1 rounded-full border border-border/60">
                      Today
                    </span>
                  </div>

                  {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground pt-8">
                      No messages yet. Say hi! 👋
                    </div>
                  )}

                  {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isMe ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                            isMe
                              ? "rounded-tr-sm gradient-hero text-primary-foreground shadow-glow"
                              : "rounded-tl-sm bg-card border border-border/60",
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}

                  {sendingMsg && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-2.5 shadow-soft inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Trip request card */}
                {activeBuddy.trip &&
                  (() => {
                    const status = tripRequests[activeBuddy.trip.id];
                    return (
                      <div className="px-5 pb-4">
                        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" /> Trip request
                          </div>
                          <div className="mt-1.5 text-sm font-semibold">
                            Join {activeBuddy.name.split(" ")[0]}'s trip to{" "}
                            {activeBuddy.trip.destination}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {activeBuddy.trip.days} days · up to ₹
                            {Number(activeBuddy.trip.budget).toLocaleString()}
                          </div>
                          {status === "accepted" ? (
                            <div className="mt-3 text-sm font-semibold text-green-500 flex items-center gap-1.5">
                              <Check className="h-4 w-4" /> You joined this
                              trip!
                            </div>
                          ) : status === "declined" ? (
                            <div className="mt-3 text-sm text-muted-foreground">
                              Request declined.
                            </div>
                          ) : (
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="hero"
                                className="flex-1 rounded-lg"
                                onClick={() =>
                                  handleTripRequest(
                                    "accepted",
                                    activeBuddy.trip!.id,
                                  )
                                }
                              >
                                <Check className="h-4 w-4" /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg"
                                onClick={() =>
                                  handleTripRequest(
                                    "declined",
                                    activeBuddy.trip!.id,
                                  )
                                }
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {/* Chat input */}
                <form
                  onSubmit={sendMessage}
                  className="p-3 border-t border-border/60 flex gap-2 bg-card"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Message ${activeBuddy.name.split(" ")[0]}...`}
                    className="rounded-xl h-11 border-border/60"
                    disabled={sendingMsg}
                  />
                  <Button
                    type="submit"
                    variant="hero"
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0"
                    disabled={sendingMsg}
                  >
                    {sendingMsg ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </aside>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
