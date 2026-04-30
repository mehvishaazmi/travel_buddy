"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Buddies", href: "/buddies" },
  { name: "Expenses", href: "/expenses" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container py-4">

        {/* GLASS NAVBAR */}
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl glass shadow-soft backdrop-blur-xl">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center text-white font-bold shadow-glow">
              T
            </div>
            <span className="font-bold text-lg tracking-tight">
              TravelBuddy
            </span>
          </Link>

          {/* NAV LINKS */}
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
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}

                  {/* ACTIVE UNDERLINE */}
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <Link
              href="/trips"
              className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              My Trips
            </Link>

            {/* ✅ FIXED (no error) */}
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}