"use client";

import Link from "next/link";
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
  Settings,
  Plus,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const trips = [
  {
    id: "1",
    name: "Himalayan Buddy Trail",
    location: "Manali, India",
    date: "May 14 – 19",
    daysLeft: 21,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
    progress: 70,
    members: 6,
    status: "Confirmed",
  },
  {
    id: "2",
    name: "Bali Buddy Escape",
    location: "Ubud, Indonesia",
    date: "Jun 02 – 12",
    daysLeft: 40,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    progress: 45,
    members: 4,
    status: "Planning",
  },
  {
    id: "5",
    name: "Lisbon Coastline",
    location: "Lisbon, Portugal",
    date: "Aug 20 – 27",
    daysLeft: 119,
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
    progress: 20,
    members: 3,
    status: "Planning",
  },
];

const buddies = [
  {
    initials: "SR",
    name: "Sara Reyes",
    trip: "Bali · Jun",
    online: true,
    gradient: "from-primary to-primary-glow",
  },
  {
    initials: "JK",
    name: "Jamal Khan",
    trip: "Manali · May",
    online: true,
    gradient: "from-accent to-primary",
  },
  {
    initials: "EN",
    name: "Elif Nazari",
    trip: "Lisbon · Aug",
    online: false,
    gradient: "from-primary-glow to-accent",
  },
  {
    initials: "MO",
    name: "Marco Oliveira",
    trip: "Bali · Jun",
    online: false,
    gradient: "from-primary to-accent",
  },
  {
    initials: "AK",
    name: "Aiko Kimura",
    trip: "Manali · May",
    online: true,
    gradient: "from-primary-glow to-primary",
  },
];

const activities = [
  {
    icon: CheckCircle2,
    color: "bg-primary/10 text-primary",
    title: "Sara settled $90",
    subtitle: "Bali Buddy Trip · just now",
  },
  {
    icon: MessageCircle,
    color: "bg-accent/15 text-accent",
    title: "Jamal sent you a message",
    subtitle: "Himalayan Buddy Trail · 12m ago",
  },
  {
    icon: Receipt,
    color: "bg-primary-glow/15 text-primary",
    title: "New expense added · Snorkeling tour",
    subtitle: "Bali Buddy Trip · 2h ago",
  },
  {
    icon: UserPlus,
    color: "bg-secondary text-foreground/70",
    title: "Elif joined Lisbon Coastline",
    subtitle: "5h ago",
  },
  {
    icon: Plane,
    color: "bg-primary/10 text-primary",
    title: "Booking confirmed · Manali stay",
    subtitle: "Yesterday",
  },
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
        "grid place-items-center rounded-full bg-gradient-to-br font-semibold text-primary-foreground shadow-glow shrink-0",
        sizes[size],
        gradient,
      )}
    >
      {initials}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pb-10 pt-28">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar
                initials="YO"
                gradient="from-primary to-primary-glow"
                size="lg"
              />
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Dashboard
                </span>
                <h1 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back, <span className="text-gradient">Alex</span> 👋
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  You have{" "}
                  <span className="font-semibold text-foreground">
                    3 upcoming trips
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-foreground">
                    2 unread messages
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-xl"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-secondary"
                aria-label="Logout"
                title="Logout"
              >
                <Settings className="h-4 w-4" />
              </button>
              <Button variant="hero" className="rounded-xl shadow-glow">
                <Plus className="h-4 w-4" /> New trip
              </Button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                icon: Plane,
                label: "Upcoming trips",
                value: "3",
                hint: "next in 21 days",
                tone: "primary",
              },
              {
                icon: Users,
                label: "Travel buddies",
                value: "12",
                hint: "+2 this month",
                tone: "accent",
              },
              {
                icon: Wallet,
                label: "Total spent",
                value: "$2,180",
                hint: "across 4 trips",
                tone: "primary",
              },
              {
                icon: TrendingUp,
                label: "You're owed",
                value: "$340",
                hint: "from 3 buddies",
                tone: "primary",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-xl",
                      s.tone === "primary"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/15 text-accent",
                    )}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 font-display text-3xl font-bold tracking-tight tabular-nums">
                  {s.value}
                </div>
                <div className="mt-0.5 text-sm font-medium">{s.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border/60 p-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Upcoming trips
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Plans coming up over the next 4 months
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  asChild
                >
                  <Link href="/explore">View all</Link>
                </Button>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {trips.map((t) => (
                  <Link
                    href={`/trips/${t.id}`}
                    key={t.id}
                    className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={t.image}
                        alt={t.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                      <span
                        className={cn(
                          "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md",
                          t.status === "Confirmed"
                            ? "bg-primary/90 text-primary-foreground"
                            : "bg-background/80 text-foreground",
                        )}
                      >
                        {t.status}
                      </span>
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">
                        <Clock className="h-3 w-3" /> {t.daysLeft}d
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-primary-foreground">
                        <div className="inline-flex items-center gap-1 text-[11px] opacity-90">
                          <MapPin className="h-3 w-3" /> {t.location}
                        </div>
                        <div className="font-display font-semibold leading-tight">
                          {t.name}
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /> {t.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> {t.members}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Planning progress</span>
                          <span className="font-semibold text-foreground">
                            {t.progress}%
                          </span>
                        </div>
                        <Progress value={t.progress} className="h-1.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border/60 p-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Expenses overview
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Across all your active trips
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  asChild
                >
                  <Link href="/expenses">Open</Link>
                </Button>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <TrendingUp className="h-4 w-4" /> You're owed
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold tabular-nums">
                    $340
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    from 3 buddies
                  </div>
                </div>

                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <TrendingDown className="h-4 w-4" /> You owe
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold tabular-nums">
                    $120
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    to 2 buddies
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-secondary/60 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Wallet className="h-4 w-4" /> Total spent
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold tabular-nums">
                    $2,180
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    across 4 trips
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-2xl border border-border/60 p-4">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Spending by category</span>
                    <span className="font-semibold text-foreground">
                      This month
                    </span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full">
                    <span className="bg-primary" style={{ width: "42%" }} />
                    <span
                      className="bg-primary-glow"
                      style={{ width: "26%" }}
                    />
                    <span className="bg-accent" style={{ width: "18%" }} />
                    <span
                      className="bg-secondary-foreground/30"
                      style={{ width: "14%" }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
                    {[
                      ["Stays", "42%", "bg-primary"],
                      ["Food", "26%", "bg-primary-glow"],
                      ["Activities", "18%", "bg-accent"],
                      ["Other", "14%", "bg-secondary-foreground/30"],
                    ].map(([k, v, c]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", c)} />
                        <span className="text-muted-foreground">{k}</span>
                        <span className="ml-auto font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border/60 p-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Travel buddies
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {buddies.length} connected
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  asChild
                >
                  <Link href="/buddies">All</Link>
                </Button>
              </div>

              <ul className="divide-y divide-border/60">
                {buddies.map((b) => (
                  <li
                    key={b.name}
                    className="flex items-center gap-3 p-4 transition-smooth hover:bg-secondary/30"
                  >
                    <div className="relative">
                      <Avatar
                        initials={b.initials}
                        gradient={b.gradient}
                        size="md"
                      />
                      {b.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-card" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {b.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {b.trip}
                      </div>
                    </div>
                    <button className="grid h-9 w-9 place-items-center rounded-xl bg-secondary transition-smooth hover:bg-primary hover:text-primary-foreground">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <Link
                href="/buddies"
                className="block w-full border-t border-dashed border-border p-4 text-center text-sm font-medium text-muted-foreground transition-smooth hover:bg-primary/5 hover:text-primary"
              >
                <UserPlus className="mr-1.5 inline h-4 w-4" /> Find more buddies
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <div className="border-b border-border/60 p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" /> Recent activity
                </h2>
              </div>

              <ol className="p-2">
                {activities.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl p-3 transition-smooth hover:bg-secondary/40"
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        a.color,
                      )}
                    >
                      <a.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-snug">
                        {a.title}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {a.subtitle}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
