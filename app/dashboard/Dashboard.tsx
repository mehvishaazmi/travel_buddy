"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useUser,
} from "@clerk/nextjs";

import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plane,
  MessageCircle,
  Receipt,
  UserPlus,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Bell,
  Plus,
  Clock,
  Loader2,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import { Footer } from "@/components/Footer";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";

type Trip = {
  id: string;

  destination: string;

  days: string;

  budget: string;

  created_at: string;

  plan?: any;
};

type BuddyProfile = {
  id: string;

  name: string;

  avatar_initials: string;

  gradient: string;

  city: string;
};

const GRADIENTS = [
  "from-primary to-primary-glow",

  "from-accent to-primary",

  "from-primary-glow to-accent",

  "from-primary to-accent",

  "from-primary-glow to-primary",
];

const Avatar = ({
  initials,
  gradient,
  size = "md",
}: {
  initials: string;

  gradient: string;

  size?: "sm" | "md" | "lg";
}) => {

  const sizes = {
    sm: "h-8 w-8 text-[10px]",

    md: "h-11 w-11 text-xs",

    lg: "h-14 w-14 text-sm",
  };

  return (
    <div
      className={cn(
        `
          grid
          shrink-0
          place-items-center
          rounded-full
          bg-gradient-to-br
          font-semibold
          text-primary-foreground
          shadow-glow
        `,

        sizes[size],

        gradient,
      )}
    >
      {initials}
    </div>
  );
};

const getImage = (
  destination: string,
) =>
  `https://picsum.photos/seed/${destination.replace(
    /\s/g,
    "",
  )}/900/500`;

const statusColor = (
  i: number,
) =>
  i === 0
    ? "bg-primary/90 text-primary-foreground"
    : "bg-background/80 text-foreground";

export default function Dashboard() {

  const {
    user,
    isLoaded,
  } = useUser();

  const router =
    useRouter();

  const userId =
    user?.id ?? "";

  const userName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split(
      "@",
    )[0] ||
    "Traveller";

  const userInitials =
    userName
      .slice(0, 2)
      .toUpperCase();

  const [
    trips,
    setTrips,
  ] = useState<Trip[]>(
    [],
  );

  const [
    savedBuddies,
    setSavedBuddies,
  ] = useState<
    BuddyProfile[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ====================================
  // FETCH
  // ====================================

  useEffect(() => {

    if (!isLoaded)
      return;

    if (!userId) {

      router.push(
        "/sign-in",
      );

      return;
    }

    fetchAll();

  }, [
    userId,
    isLoaded,
  ]);

  // ====================================
  // REALTIME
  // ====================================

  useEffect(() => {

    if (!userId)
      return;

    const channel =
      supabase
        .channel(
          `dashboard-${userId}`,
        )

        .on(
          "postgres_changes",
          {
            event: "*",

            schema:
              "public",

            table:
              "trip_members",
          },

          async () => {

            await fetchTrips();
          },
        )

        .on(
          "postgres_changes",
          {
            event: "*",

            schema:
              "public",

            table:
              "saved_buddies",
          },

          async () => {

            await fetchBuddies();
          },
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel,
      );
    };

  }, [userId]);

  async function fetchAll() {

    try {

      setLoading(true);

      await Promise.all([
        fetchTrips(),

        fetchBuddies(),
      ]);

    } finally {

      setLoading(false);
    }
  }

  // ====================================
  // FETCH TRIPS
  // ====================================

  async function fetchTrips() {

    try {

      // GET MEMBERSHIPS
      const {
        data:
          memberships,
      } = await supabase
        .from(
          "trip_members",
        )
        .select(
          "trip_id",
        )
        .eq(
          "user_id",
          userId,
        );

      const tripIds =
        memberships?.map(
          (
            m,
          ) => m.trip_id,
        ) || [];

      if (
        tripIds.length === 0
      ) {

        setTrips([]);

        return;
      }

      // GET TRIPS
      const {
        data,
      } = await supabase
        .from("trips")
        .select("*")
        .in(
          "id",
          tripIds,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(6);

      setTrips(
        data || [],
      );

    } catch (error) {

      console.error(
        error,
      );
    }
  }

  // ====================================
  // FETCH BUDDIES
  // ====================================

  async function fetchBuddies() {

    try {

      const { data } =
        await supabase
          .from(
            "saved_buddies",
          )
          .select(
            `
            saved_user_id,
            buddy_profiles!saved_buddies_saved_user_id_fkey(*)
          `,
          )
          .eq(
            "saver_user_id",
            userId,
          )
          .limit(5);

      if (data) {

        const profiles =
          data
            .map(
              (
                r: any,
              ) =>
                r.buddy_profiles,
            )
            .filter(Boolean);

        setSavedBuddies(
          profiles,
        );
      }

    } catch (error) {

      console.error(
        error,
      );
    }
  }

  // ====================================
  // MEMOS
  // ====================================

  const totalBudget =
    useMemo(
      () =>
        trips.reduce(
          (
            sum,
            t,
          ) =>
            sum +
            Number(
              t.budget ||
                0,
            ),

          0,
        ),

      [trips],
    );

  const totalDays =
    useMemo(
      () =>
        trips.reduce(
          (
            s,
            t,
          ) =>
            s +
            Number(
              t.days ||
                0,
            ),

          0,
        ),

      [trips],
    );

  const upcomingCount =
    useMemo(
      () => trips.length,

      [trips],
    );

  const averageTripBudget =
    useMemo(
      () =>
        upcomingCount
          ? Math.round(
              totalBudget /
                upcomingCount,
            )
          : 0,

      [
        totalBudget,
        upcomingCount,
      ],
    );

  const averagePerDay =
    useMemo(
      () =>
        totalDays
          ? Math.round(
              totalBudget /
                totalDays,
            )
          : 0,

      [
        totalBudget,
        totalDays,
      ],
    );

  const statCards = [
    {
      icon: Plane,

      label:
        "Upcoming trips",

      value:
        String(
          upcomingCount,
        ),

      hint:
        "from your plans",

      tone:
        "primary",
    },

    {
      icon: Users,

      label:
        "Travel buddies",

      value:
        String(
          savedBuddies.length,
        ),

      hint:
        "saved buddies",

      tone:
        "accent",
    },

    {
      icon: Wallet,

      label:
        "Total budget",

      value: `₹${totalBudget.toLocaleString()}`,

      hint:
        "across all trips",

      tone:
        "primary",
    },

    {
      icon: TrendingUp,

      label:
        "Avg per trip",

      value:
        averageTripBudget
          ? `₹${averageTripBudget.toLocaleString()}`
          : "—",

      hint:
        "budget average",

      tone:
        "primary",
    },
  ];

  // ====================================
  // LOADING
  // ====================================

  if (!isLoaded) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-background">

        <Loader2
          className="
            h-10
            w-10
            animate-spin
            text-primary
          "
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      {/* HERO */}
      <section
        className="
          relative
          overflow-hidden
          pb-10
          pt-28
        "
      >

        <div
          className="
            absolute
            inset-0
            -z-10
            opacity-50
          "
          style={{
            background:
              "var(--gradient-mesh)",
          }}
        />

        <div className="container">

          {/* TOP */}
          <div className="flex flex-wrap items-end justify-between gap-6">

            <div className="flex items-center gap-5">

              <Avatar
                initials={
                  userInitials
                }
                gradient="from-primary to-primary-glow"
                size="lg"
              />

              <div>

                <span
                  className="
                    inline-block
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-primary
                  "
                >
                  Dashboard
                </span>

                <h1
                  className="
                    mt-3
                    text-balance
                    font-display
                    text-3xl
                    font-bold
                    tracking-tight
                    sm:text-4xl
                  "
                >

                  Welcome back,{" "}

                  <span className="text-gradient">

                    {userName}
                  </span>{" "}

                  👋
                </h1>

                <p
                  className="
                    mt-1.5
                    text-sm
                    text-muted-foreground
                  "
                >
                  You have{" "}

                  <span className="font-semibold text-foreground">

                    {
                      upcomingCount
                    }{" "}
                    trips
                  </span>{" "}

                  and{" "}

                  <span className="font-semibold text-foreground">

                    {
                      savedBuddies.length
                    }{" "}
                    saved buddies
                  </span>.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              <Button
                variant="outline"
                size="icon"
                className="relative rounded-xl"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <Button
                variant="hero"
                className="rounded-xl shadow-glow"
                onClick={() =>
                  router.push(
                    "/plan-trip",
                  )
                }
              >

                <Plus className="h-4 w-4" />

                New trip
              </Button>
            </div>
          </div>

          {/* STATS */}
          <div
            className="
              mt-10
              grid
              grid-cols-2
              gap-4
              lg:grid-cols-4
            "
          >

            {statCards.map(
              (s) => (

                <div
                  key={
                    s.label
                  }
                  className="
                    rounded-2xl
                    border
                    border-border/60
                    bg-card
                    p-5
                    shadow-soft
                    transition-smooth
                    hover:-translate-y-0.5
                    hover:shadow-card
                  "
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={cn(
                        `
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-xl
                        `,

                        s.tone ===
                          "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/15 text-accent",
                      )}
                    >

                      <s.icon className="h-5 w-5" />
                    </span>

                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div
                    className="
                      mt-4
                      font-display
                      text-3xl
                      font-bold
                      tracking-tight
                      tabular-nums
                    "
                  >
                    {s.value}
                  </div>

                  <div className="mt-0.5 text-sm font-medium">

                    {s.label}
                  </div>

                  <div className="mt-0.5 text-xs text-muted-foreground">

                    {s.hint}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">

        <div
          className="
            container
            grid
            gap-6
            lg:grid-cols-[1fr_360px]
          "
        >

          {/* LEFT */}
          <div className="space-y-6">

            {/* TRIPS */}
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-border/60
                bg-card
                shadow-soft
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-border/60
                  p-5
                "
              >

                <div>

                  <h2
                    className="
                      font-display
                      text-lg
                      font-semibold
                    "
                  >
                    Your trips
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-muted-foreground
                    "
                  >
                    All your planned adventures
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  asChild
                >
                  <Link href="/trips">

                    View all
                  </Link>
                </Button>
              </div>

              {loading ? (

                <div className="flex justify-center py-16">

                  <Loader2
                    className="
                      h-6
                      w-6
                      animate-spin
                      text-primary
                    "
                  />
                </div>

              ) : trips.length ===
                0 ? (

                <div className="py-16 text-center">

                  <p
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No trips yet.
                  </p>

                  <Button
                    variant="hero"
                    className="mt-4 rounded-xl"
                    onClick={() =>
                      router.push(
                        "/plan-trip",
                      )
                    }
                  >
                    Plan your first trip ✨
                  </Button>
                </div>

              ) : (

                <div
                  className="
                    grid
                    gap-4
                    p-5
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {trips.map(
                    (
                      t,
                      i,
                    ) => (

                      <Link
                        href={`/trips/${t.id}`}
                        key={t.id}
                        className="
                          group
                          overflow-hidden
                          rounded-2xl
                          border
                          border-border/60
                          bg-card
                          shadow-soft
                          transition-smooth
                          hover:-translate-y-1
                          hover:shadow-card
                        "
                      >

                        <div className="relative h-36 overflow-hidden">

                          <img
                            src={getImage(
                              t.destination,
                            )}
                            alt={
                              t.destination
                            }
                            loading="lazy"
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-110
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-foreground/70
                              to-transparent
                            "
                          />

                          <span
                            className={cn(
                              `
                                absolute
                                left-3
                                top-3
                                rounded-full
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wider
                                backdrop-blur-md
                              `,

                              statusColor(
                                i,
                              ),
                            )}
                          >

                            {i === 0
                              ? "Latest"
                              : "Planning"}
                          </span>

                          <span
                            className="
                              absolute
                              right-3
                              top-3
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              bg-background/80
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              backdrop-blur-md
                            "
                          >

                            <Clock className="h-3 w-3" />

                            {t.days}d
                          </span>

                          <div
                            className="
                              absolute
                              bottom-3
                              left-3
                              right-3
                              text-primary-foreground
                            "
                          >

                            <div
                              className="
                                inline-flex
                                items-center
                                gap-1
                                text-[11px]
                                opacity-90
                              "
                            >

                              <MapPin className="h-3 w-3" />

                              {
                                t.destination
                              }
                            </div>
                          </div>
                        </div>

                        <div className="p-4">

                          <div className="flex items-center justify-between text-xs">

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-muted-foreground
                              "
                            >

                              <Calendar className="h-3.5 w-3.5" />

                              {new Date(
                                t.created_at,
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  month:
                                    "short",

                                  day:
                                    "numeric",
                                },
                              )}
                            </span>

                            <span className="font-semibold text-primary">

                              ₹
                              {Number(
                                t.budget,
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="mt-3">

                            <div
                              className="
                                mb-1.5
                                flex
                                items-center
                                justify-between
                                text-[11px]
                                text-muted-foreground
                              "
                            >

                              <span>

                                Planning progress
                              </span>

                              <span
                                className="
                                  font-semibold
                                  text-foreground
                                "
                              >

                                {t.plan
                                  ? "100%"
                                  : "60%"}
                              </span>
                            </div>

                            <Progress
                              value={
                                t.plan
                                  ? 100
                                  : 60
                              }
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* BUDDIES */}
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-border/60
                bg-card
                shadow-soft
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-border/60
                  p-5
                "
              >

                <div>

                  <h2
                    className="
                      font-display
                      text-lg
                      font-semibold
                    "
                  >
                    Travel buddies
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-muted-foreground
                    "
                  >

                    {
                      savedBuddies.length
                    }{" "}
                    saved
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  asChild
                >

                  <Link href="/buddies">

                    All
                  </Link>
                </Button>
              </div>

              {loading ? (

                <div className="flex justify-center py-8">

                  <Loader2
                    className="
                      h-5
                      w-5
                      animate-spin
                      text-primary
                    "
                  />
                </div>

              ) : savedBuddies.length ===
                0 ? (

                <div
                  className="
                    py-8
                    text-center
                    text-sm
                    text-muted-foreground
                  "
                >
                  No saved buddies yet.

                  <br />

                  <Link
                    href="/buddies"
                    className="
                      font-medium
                      text-primary
                    "
                  >
                    Find some →
                  </Link>
                </div>

              ) : (

                <ul className="divide-y divide-border/60">

                  {savedBuddies.map(
                    (
                      b,
                    ) => (

                      <li
                        key={b.id}
                        className="
                          flex
                          items-center
                          gap-3
                          p-4
                          transition-smooth
                          hover:bg-secondary/30
                        "
                      >

                        <div className="relative">

                          <Avatar
                            initials={
                              b.avatar_initials ||
                              b.name
                                .slice(
                                  0,
                                  2,
                                )
                                .toUpperCase()
                            }
                            gradient={
                              b.gradient ||
                              GRADIENTS[0]
                            }
                            size="md"
                          />

                          <span
                            className="
                              absolute
                              bottom-0
                              right-0
                              h-3
                              w-3
                              rounded-full
                              bg-primary
                              ring-2
                              ring-card
                            "
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="truncate text-sm font-semibold">

                            {b.name}
                          </div>

                          <div
                            className="
                              truncate
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {b.city}
                          </div>
                        </div>

                        <Link
                          href="/buddies"
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-xl
                            bg-secondary
                            transition-smooth
                            hover:bg-primary
                            hover:text-primary-foreground
                          "
                        >

                          <MessageCircle className="h-4 w-4" />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}