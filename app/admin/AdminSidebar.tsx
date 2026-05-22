"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Users,
  Map,
  CreditCard,
  Bot,
  Flag,
  LogOut,
  Shield,
  Moon,
  Sun,
} from "lucide-react";

const NAV = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Trips",
    href: "/admin/trips",
    icon: Map,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    soon: true,
  },
  {
    label: "AI Usage",
    href: "/admin/ai",
    icon: Bot,
    soon: true,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: Flag,
    soon: true,
  },
];

export function AdminSidebar() {

  const pathname =
    usePathname() || "";

  const [theme, setTheme] =
    useState("dark");

  // Load saved theme
  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        "admin-theme"
      );

    if (savedTheme) {

      setTheme(savedTheme);

      const adminLayout =
        document.getElementById(
          "admin-layout"
        );

      if (adminLayout) {

        if (
          savedTheme === "light"
        ) {
          adminLayout.classList.remove(
            "bg-[#0a0a0f]",
            "text-white"
          );

          adminLayout.classList.add(
            "bg-[#f5f7fb]",
            "text-black"
          );
        }
      }
    }

  }, []);

  // Toggle theme
  const toggleTheme = () => {

    const newTheme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);

    localStorage.setItem(
      "admin-theme",
      newTheme
    );

    const adminLayout =
      document.getElementById(
        "admin-layout"
      );

    if (!adminLayout) return;

    if (newTheme === "light") {

      adminLayout.classList.remove(
        "bg-[#0a0a0f]",
        "text-white"
      );

      adminLayout.classList.add(
        "bg-[#f5f7fb]",
        "text-black"
      );

    } else {

      adminLayout.classList.remove(
        "bg-[#f5f7fb]",
        "text-black"
      );

      adminLayout.classList.add(
        "bg-[#0a0a0f]",
        "text-white"
      );
    }
  };

  const isLight =
    theme === "light";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r transition-colors duration-300",

        isLight
          ? "border-black/10 bg-white"
          : "border-white/[0.06] bg-[#0d0d14]"
      )}
    >

      {/* Logo */}
      <div
        className={cn(
          "border-b px-6 py-6",

          isLight
            ? "border-black/10"
            : "border-white/[0.06]"
        )}
      >

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/20">

            <Shield className="h-4 w-4 text-cyan-400" />
          </div>

          <div>

            <p
              className={cn(
                "text-sm font-semibold tracking-tight",

                isLight
                  ? "text-black"
                  : "text-white"
              )}
            >
              TravelBuddy
            </p>

            <p
              className={cn(
                "text-[10px] uppercase tracking-widest",

                isLight
                  ? "text-black/40"
                  : "text-white/30"
              )}
            >
              Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">

        {NAV.map((item) => {

          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(
                  item.href
                );

          return (
            <Link
              key={item.href}
              href={
                item.soon
                  ? "#"
                  : item.href
              }
              aria-disabled={
                item.soon
              }
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",

                active
                  ? isLight
                    ? "bg-black/5 text-black"
                    : "bg-white/[0.08] text-white"
                  : isLight
                  ? "text-black/50 hover:bg-black/5 hover:text-black"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",

                item.soon &&
                  "pointer-events-none cursor-not-allowed opacity-40"
              )}
            >

              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",

                  active
                    ? "text-cyan-400"
                    : isLight
                    ? "text-black/40 group-hover:text-black"
                    : "text-white/30 group-hover:text-white/50"
                )}
              />

              <span className="flex-1">
                {item.label}
              </span>

              {item.soon && (
                <span
                  className={cn(
                    "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",

                    isLight
                      ? "border-black/10 text-black/30"
                      : "border-white/10 text-white/20"
                  )}
                >
                  Soon
                </span>
              )}

              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-3">

        <button
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",

            isLight
              ? "bg-black/5 text-black hover:bg-black/10"
              : "bg-white/[0.04] text-white hover:bg-white/[0.08]"
          )}
        >

          <span>
            Theme
          </span>

          {isLight ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-t px-3 py-4",

          isLight
            ? "border-black/10"
            : "border-white/[0.06]"
        )}
      >

        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",

            isLight
              ? "text-black/50 hover:bg-black/5 hover:text-black"
              : "text-white/30 hover:bg-white/[0.04] hover:text-white/60"
          )}
        >

          <LogOut className="h-4 w-4" />

          Back to app
        </Link>
      </div>
    </aside>
  );
}