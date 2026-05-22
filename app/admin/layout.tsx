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
  // Get current user
  const { userId } = await auth();

  // Not signed in
  if (!userId) {
    redirect("/sign-in");
  }

  // Clerk client
  const client = await clerkClient();

  // Fetch user
  const user = await client.users.getUser(userId);

  // Check admin role
  const isAdmin = user.publicMetadata?.role === "admin";

  // Not admin
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}