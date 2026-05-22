import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── Auth guard helper ──────────────────────────
async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Clerk client
  const client = await clerkClient();

  // Current user
  const user = await client.users.getUser(userId);

  // Admin check
  if (user.publicMetadata?.role !== "admin") {
    return null;
  }

  return userId;
}
// ── GET /api/admin?section=overview|users|trips ──
export async function GET(req: Request) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") ?? "overview";

  try {
    if (section === "overview") {
      // Parallel fetch of all overview stats
      const [
        { count: totalUsers },
        { count: totalTrips },
        { data: recentTrips },
        { data: settlements },
        { data: buddyProfiles },
      ] = await Promise.all([
        supabaseAdmin.from("trip_members").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("trips").select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("trips")
          .select("id, destination, budget, created_at, user_id")
          .order("created_at", { ascending: false })
          .limit(5),
        supabaseAdmin
          .from("settlements")
          .select("amount, created_at, status")
          .eq("status", "completed"),
        supabaseAdmin
          .from("buddy_profiles")
          .select("*", { count: "exact", head: true }),
      ]);

      const totalRevenue = (settlements ?? []).reduce(
        (sum: number, s: any) => sum + Number(s.amount ?? 0),
        0
      );

      // Signups last 7 days (from trips as a proxy — trips table has user_id + created_at)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentSignups } = await supabaseAdmin
        .from("trips")
        .select("created_at")
        .gte("created_at", sevenDaysAgo);

      return NextResponse.json({
        totalTrips: totalTrips ?? 0,
        totalMembers: totalUsers ?? 0,
        totalBuddyProfiles: buddyProfiles ?? 0,
        totalRevenue,
        completedSettlements: (settlements ?? []).length,
        recentTrips: recentTrips ?? [],
        tripsLast7Days: (recentSignups ?? []).length,
      });
    }

    if (section === "users") {
      const page = Number(searchParams.get("page") ?? 1);
      const limit = 20;
      const offset = (page - 1) * limit;

      const { data: profiles, count } = await supabaseAdmin
        .from("buddy_profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Get trip counts per user
      const userIds = (profiles ?? []).map((p: any) => p.user_id);
      const { data: tripCounts } = userIds.length
        ? await supabaseAdmin
            .from("trips")
            .select("user_id")
            .in("user_id", userIds)
        : { data: [] };

      const tripCountMap: Record<string, number> = {};
      (tripCounts ?? []).forEach((t: any) => {
        tripCountMap[t.user_id] = (tripCountMap[t.user_id] ?? 0) + 1;
      });

      const enriched = (profiles ?? []).map((p: any) => ({
        ...p,
        tripCount: tripCountMap[p.user_id] ?? 0,
      }));

      return NextResponse.json({ profiles: enriched, total: count ?? 0 });
    }

    if (section === "trips") {
      const page = Number(searchParams.get("page") ?? 1);
      const limit = 20;
      const offset = (page - 1) * limit;
      const search = searchParams.get("q") ?? "";

      let query = supabaseAdmin
        .from("trips")
        .select("id, destination, days, budget, created_at, user_id, invite_code", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.ilike("destination", `%${search}%`);
      }

      const { data: trips, count } = await query;

      // Member counts per trip
      const tripIds = (trips ?? []).map((t: any) => t.id);
      const { data: memberRows } = tripIds.length
        ? await supabaseAdmin
            .from("trip_members")
            .select("trip_id")
            .in("trip_id", tripIds)
        : { data: [] };

      const memberMap: Record<string, number> = {};
      (memberRows ?? []).forEach((m: any) => {
        memberMap[m.trip_id] = (memberMap[m.trip_id] ?? 0) + 1;
      });

      const enriched = (trips ?? []).map((t: any) => ({
        ...t,
        memberCount: memberMap[t.id] ?? 0,
      }));

      return NextResponse.json({ trips: enriched, total: count ?? 0 });
    }

    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  } catch (err: any) {
    console.error("[ADMIN API]", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}

// ── POST /api/admin — actions (ban user, delete trip) ──
export async function POST(req: Request) {
  const adminId = await requireAdmin();

  if (!adminId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const { action, targetId } = body;

  try {

    // =====================================
    // DELETE TRIP
    // =====================================

    if (action === "delete_trip") {

      if (!targetId) {
        return NextResponse.json(
          { error: "Missing targetId" },
          { status: 400 }
        );
      }

      // Get expense IDs
      const { data: expenses } =
        await supabaseAdmin
          .from("expenses")
          .select("id")
          .eq("trip_id", targetId);

      const expenseIds =
        (expenses ?? []).map(
          (e: any) => e.id
        );

      // Delete expense splits
      if (expenseIds.length > 0) {
        await supabaseAdmin
          .from("expense_splits")
          .delete()
          .in("expense_id", expenseIds);
      }

      // Delete expenses
      await supabaseAdmin
        .from("expenses")
        .delete()
        .eq("trip_id", targetId);

      // Delete settlements
      await supabaseAdmin
        .from("settlements")
        .delete()
        .eq("trip_id", targetId);

      // Delete trip members
      await supabaseAdmin
        .from("trip_members")
        .delete()
        .eq("trip_id", targetId);

      // Delete trip
      const { error } =
        await supabaseAdmin
          .from("trips")
          .delete()
          .eq("id", targetId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Trip deleted",
      });
    }

    // =====================================
    // VERIFY USER
    // =====================================

    if (action === "verify_user") {

      if (!targetId) {
        return NextResponse.json(
          { error: "Missing targetId" },
          { status: 400 }
        );
      }

      const { error } =
        await supabaseAdmin
          .from("buddy_profiles")
          .update({
            is_verified: true,
          })
          .eq("user_id", targetId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User verified",
      });
    }

    // =====================================
    // UNVERIFY USER
    // =====================================

    if (action === "unverify_user") {

      if (!targetId) {
        return NextResponse.json(
          { error: "Missing targetId" },
          { status: 400 }
        );
      }

      const { error } =
        await supabaseAdmin
          .from("buddy_profiles")
          .update({
            is_verified: false,
          })
          .eq("user_id", targetId);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User unverified",
      });
    }

    // =====================================
    // UNKNOWN ACTION
    // =====================================

    return NextResponse.json(
      { error: "Unknown action" },
      { status: 400 }
    );

  } catch (error: any) {

    console.error(
      "[ADMIN_POST_API]",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ??
          "Server error",
      },
      { status: 500 }
    );
  }
}