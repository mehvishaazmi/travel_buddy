import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "No ID provided" },
        { status: 400 },
      );
    }

    // ====================================
    // VERIFY MEMBERSHIP
    // ====================================

    const {
      data: membership,
      error: membershipError,
    } = await supabaseAdmin
      .from("trip_members")
      .select("*")
      .eq("trip_id", id)
      .eq("user_id", userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 },
      );
    }

    // ====================================
    // FETCH TRIP
    // ====================================

    const {
      data: trip,
      error,
    } = await supabaseAdmin
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(trip);

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err.message || "Server error",
      },
      { status: 500 },
    );
  }
}