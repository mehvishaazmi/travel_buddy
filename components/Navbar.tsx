"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Buddies", href: "/buddies" },
  { label: "Expenses", href: "/expenses" },
];

type User = {
  id: string;
  email: string;
} | null;

export const Navbar = () => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [hasTrips, setHasTrips] = useState<boolean | null>(null);

  const links = user
    ? [...publicLinks, { label: "Dashboard", href: "/dashboard" }]
    : publicLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);

    const init = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.ok ? await res.json() : null;
        setUser(data?.user || null);

        if (data?.user) {
          const tripRes = await fetch("/api/trips");
          const tripData = await tripRes.json();
          setHasTrips((tripData?.trips || []).length > 0);
        } else {
          setHasTrips(false);
        }
      } catch {
        setUser(null);
        setHasTrips(false);
      }
    };

    init();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setHasTrips(false);
    window.location.href = "/login";
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-hero shadow-glow">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold">
            TravelBuddy
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-all duration-300",
                  "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300",
                  "hover:after:w-full hover:text-foreground hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]",
                  isActive
                    ? "text-foreground after:w-full"
                    : "text-foreground/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              {/* 🔥 SMART TRIP LINK */}
              {hasTrips !== null && (
                <Link
                  href={hasTrips ? "/trips" : "/planner"}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-300",
                    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300",
                    "hover:after:w-full hover:text-foreground hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]",
                    pathname === (hasTrips ? "/trips" : "/planner")
                      ? "text-foreground after:w-full"
                      : "text-foreground/70"
                  )}
                >
                  {hasTrips ? "My Trips" : "Plan Trip"}
                </Link>
              )}

              {/* EMAIL */}
              <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                {user.email}
              </span>

              {/* LOGOUT */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button variant="hero" size="sm" className="rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user && hasTrips !== null && (
              <Link
                href={hasTrips ? "/trips" : "/planner"}
                onClick={() => setOpen(false)}
              >
                <Button className="w-full rounded-xl">
                  {hasTrips ? "My Trips" : "Plan Trip"}
                </Button>
              </Link>
            )}

            {user ? (
              <>
                <div className="text-sm text-muted-foreground px-2">
                  {user.email}
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};