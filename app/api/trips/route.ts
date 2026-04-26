import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/db";

export async function GET() {
  try {
    // ── 1. Authenticate ──────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
      };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user_id = decoded.id;

    // ── 2. Query — filtered by user_id so users never see each other's trips ─
    const { data: trips, error } = await supabaseAdmin
      .from("trips")
      .select("id, destination, days, budget, plan, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DB ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── 3. Return ─────────────────────────────────────────────────────────────
    return NextResponse.json({ trips: trips ?? [] });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server failed" }, { status: 500 });
  }
}