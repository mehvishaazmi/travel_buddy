import { NextResponse } from "next/server";

import Razorpay from "razorpay";

import crypto from "crypto";

import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

// ====================================
// RAZORPAY INSTANCE
// ====================================

const razorpay =
  new Razorpay({
    key_id:
      process.env
        .RAZORPAY_KEY_ID!,

    key_secret:
      process.env
        .RAZORPAY_KEY_SECRET!,
  });

// ====================================
// CREATE ORDER
// ====================================

export async function POST(
  req: Request,
) {

  try {

    // ====================================
    // AUTH
    // ====================================

    const { userId } =
      await auth();

    if (!userId) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 },
      );
    }

    // ====================================
    // BODY
    // ====================================

    const body =
      await req.json();

    const {
      amount,
      trip_id,
      receiver_user_id,
    } = body;

    const normalizedAmount =
      Number(amount);

    // ====================================
    // VALIDATION
    // ====================================

    if (
      isNaN(
        normalizedAmount,
      ) ||
      normalizedAmount <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid amount",
        },
        { status: 400 },
      );
    }

    // ====================================
    // MAX LIMIT
    // ====================================

    if (
      normalizedAmount >
      100000
    ) {

      return NextResponse.json(
        {
          error:
            "Amount exceeds limit",
        },
        { status: 400 },
      );
    }

    // ====================================
    // REQUIRED FIELDS
    // ====================================

    if (
      !trip_id ||
      !receiver_user_id
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 },
      );
    }

    // ====================================
    // VERIFY PAYER MEMBERSHIP
    // ====================================

    const {
      data: payerMember,
      error: payerError,
    } =
      await supabaseAdmin
        .from(
          "trip_members",
        )
        .select("*")
        .eq(
          "trip_id",
          trip_id,
        )
        .eq(
          "user_id",
          userId,
        )
        .single();

    if (
      payerError ||
      !payerMember
    ) {

      return NextResponse.json(
        {
          error:
            "Access denied",
        },
        { status: 403 },
      );
    }

    // ====================================
    // VERIFY RECEIVER MEMBERSHIP
    // ====================================

    const {
      data: receiverMember,
      error: receiverError,
    } =
      await supabaseAdmin
        .from(
          "trip_members",
        )
        .select("*")
        .eq(
          "trip_id",
          trip_id,
        )
        .eq(
          "user_id",
          receiver_user_id,
        )
        .single();

    if (
      receiverError ||
      !receiverMember
    ) {

      return NextResponse.json(
        {
          error:
            "Receiver not found",
        },
        { status: 404 },
      );
    }

    // ====================================
    // PREVENT SELF PAYMENT
    // ====================================

    if (
      userId ===
      receiver_user_id
    ) {

      return NextResponse.json(
        {
          error:
            "Cannot pay yourself",
        },
        { status: 400 },
      );
    }

    // ====================================
    // CREATE ORDER
    // ====================================

    const order =
      await razorpay.orders.create(
        {
          amount:
            Math.round(
              normalizedAmount *
                100,
            ),

          currency:
            "INR",

          receipt:
            `receipt_${crypto.randomUUID()}`,

          notes: {
            trip_id,

            payer_user_id:
              userId,

            receiver_user_id,
          },
        },
      );

    // ====================================
    // SUCCESS
    // ====================================

    return NextResponse.json(
      order,
    );

  } catch (error) {

    console.error(
      "CREATE ORDER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create order",
      },
      { status: 500 },
    );
  }
}