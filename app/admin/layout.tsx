import { auth, clerkClient } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import { ReactNode } from "react";

import { AdminSidebar } from "./AdminSidebar";

export const metadata = {
  title: "TravelBuddy Admin",
  description: "Internal operations panel",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {

  // Current user
  const { userId } = await auth();

  // Not signed in
  if (!userId) {
    redirect("/sign-in");
  }

  // Clerk client
  const client = await clerkClient();

  // Fetch user
  const user =
    await client.users.getUser(userId);

  // Admin check
  const isAdmin =
    user.publicMetadata?.role === "admin";

  // Not admin
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div
      id="admin-layout"
      className="flex min-h-screen bg-[#0a0a0f] text-white transition-colors duration-300"
    >

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="ml-64 flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}