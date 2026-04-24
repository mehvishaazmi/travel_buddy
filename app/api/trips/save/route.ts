import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ IMPORTANT
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, destination, days, budget, plan } = body;

    if (!user_id) {
      return NextResponse.json({ error: "No user_id" }, { status: 400 });
    }

    const { data, error } = await supabase.from("trips").insert([
      {
        user_id,
        destination,
        days,
        budget,
        plan,
      },
    ]);

    if (error) {
      console.error("DB ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server failed" }, { status: 500 });
  }
}