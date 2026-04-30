import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// 🔹 GET ALL TRIPS
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}


// 🔹 CREATE TRIP (🔥 FIXED VERSION)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { destination, days, budget, plan } = body;

    if (!destination || !days || !budget || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 INSERT ONLY (NO .single() here)
    const { error: insertError } = await supabaseAdmin
      .from("trips")
      .insert([
        {
          user_id: userId,
          destination,
          days,
          budget,
          plan,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // 🔥 FETCH LATEST INSERTED TRIP (GUARANTEED)
    const { data, error } = await supabaseAdmin
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Trip created but ID fetch failed" },
        { status: 500 }
      );
    }

    // ✅ ALWAYS RETURNS VALID ID
    return NextResponse.json({
      message: "Trip created",
      trip: data,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}