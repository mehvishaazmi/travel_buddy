"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Buddies", href: "/buddies" },
  { name: "Expenses", href: "/expenses" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Trips", href: "/trips" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Add this line — useAuth is already imported, just destructure it:
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container py-4">
        <div className="rounded-2xl glass shadow-soft backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-3">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center text-white font-bold shadow-glow">
                T
              </div>
              <span className="font-bold text-lg tracking-tight">
                TravelBuddy
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium px-4 py-2 rounded-xl gradient-hero text-white shadow-glow hover:opacity-90 transition-all"
                  >
                    Sign up
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden grid place-items-center h-9 w-9 rounded-xl bg-secondary hover:bg-secondary/80 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <nav className="md:hidden border-t border-border/60 px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!isSignedIn && (
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium text-center gradient-hero text-white shadow-glow"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
