import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into Supabase
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([{ email, password: hashedPassword }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}