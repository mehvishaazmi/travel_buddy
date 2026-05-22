"use client";

import Link from "next/link";
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
  const pathname = usePathname() || "";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-[#0d0d14]">

      {/* Logo */}
      <div className="border-b border-white/[0.06] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/20">
            <Shield className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              TravelBuddy
            </p>

            <p className="text-[10px] uppercase tracking-widest text-white/30">
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
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              aria-disabled={item.soon}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                active
                  ? "bg-white/[0.08] text-white"
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
                    : "text-white/30 group-hover:text-white/50"
                )}
              />

              <span className="flex-1">{item.label}</span>

              {item.soon && (
                <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/20">
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

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60"
        >
          <LogOut className="h-4 w-4" />
          Back to app
        </Link>
      </div>
    </aside>
  );
}