import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import Dashboard from "./Dashboard";

// ====================================
// DASHBOARD PAGE
// ====================================

export default async function DashboardPage() {

  const { userId } =
    await auth();

  // ====================================
  // AUTH PROTECTION
  // ====================================

  if (!userId) {

    redirect(
      "/sign-in?redirect_url=/dashboard",
    );
  }

  // ====================================
  // PAGE
  // ====================================

  return <Dashboard />;
}