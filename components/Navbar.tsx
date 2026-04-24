"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User>(null);

  // ✅ FIX: dynamic links based on user
  const links = user
    ? [...publicLinks, { label: "Dashboard", href: "/dashboard" }]
    : publicLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);

    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      }
    };

    checkUser();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-smooth",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-hero shadow-glow">
            <Compass className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold">TravelBuddy</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="story-link text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="max-w-[180px] truncate text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="outline"
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
                <Button variant="ghost" className="rounded-xl">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="hero" className="rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-xl">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="hero" className="w-full rounded-xl">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};