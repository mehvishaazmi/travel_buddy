import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

// ====================================
// VALID CATEGORIES
// ====================================

const VALID_CATEGORIES = [
  "Food",
  "Hotel",
  "Transport",
  "Shopping",
  "Activities",
  "Other",
];

// ====================================
// CREATE EXPENSE
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
      trip_id,
      title,
      amount,
      category,
    } = body;

    // ====================================
    // SANITIZE INPUTS
    // ====================================

    const safeTripId =
      String(
        trip_id || "",
      ).trim();

    const safeTitle =
      String(
        title || "",
      ).trim();

    const normalizedAmount =
      Number(amount);

    // ====================================
    // VALIDATION
    // ====================================

    if (
      !safeTripId ||
      !safeTitle ||
      !normalizedAmount
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 },
      );
    }

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
    // LIMIT PROTECTION
    // ====================================

    if (
      normalizedAmount >
      1000000
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
    // CATEGORY VALIDATION
    // ====================================

    const safeCategory =
      VALID_CATEGORIES.includes(
        category,
      )
        ? category
        : "Other";

    // ====================================
    // GET MEMBERS
    // ====================================

    const {
      data: members,
      error:
        memberError,
    } =
      await supabaseAdmin
        .from(
          "trip_members",
        )
        .select("*")
        .eq(
          "trip_id",
          safeTripId,
        );

    if (
      memberError
    ) {

      return NextResponse.json(
        {
          error:
            memberError.message,
        },
        { status: 500 },
      );
    }

    if (
      !members ||
      members.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "No trip members found",
        },
        { status: 400 },
      );
    }

    // ====================================
    // VERIFY CURRENT MEMBER
    // ====================================

    const currentMember =
      members.find(
        (
          member,
        ) =>
          member.user_id ===
          userId,
      );

    if (
      !currentMember
    ) {

      return NextResponse.json(
        {
          error:
            "You are not a member of this trip",
        },
        { status: 403 },
      );
    }

    // ====================================
    // CREATE EXPENSE
    // ====================================

    const {
      data: expense,
      error:
        expenseError,
    } =
      await supabaseAdmin
        .from(
          "expenses",
        )
        .insert({
          trip_id:
            safeTripId,

          user_id:
            userId,

          title:
            safeTitle,

          amount:
            normalizedAmount,

          paid_by:
            userId,

          paid_by_name:
            currentMember.user_name,

          category:
            safeCategory,
        })
        .select()
        .single();

    if (
      expenseError ||
      !expense
    ) {

      console.error(
        expenseError,
      );

      return NextResponse.json(
        {
          error:
            expenseError?.message ||
            "Failed to create expense",
        },
        { status: 500 },
      );
    }

    // ====================================
    // SPLIT LOGIC
    // ====================================

    const memberCount =
      members.length;

    // PREVENT FLOATING POINT ISSUES
    const splitInPaise =
      Math.floor(
        (normalizedAmount *
          100) /
          memberCount,
      );

    let remainingPaise =
      Math.round(
        normalizedAmount *
          100,
      );

    const splitRows =
      members.map(
        (
          member,
          index,
        ) => {

          let splitAmountPaise =
            splitInPaise;

          // LAST MEMBER GETS REMAINDER
          if (
            index ===
            memberCount -
              1
          ) {

            splitAmountPaise =
              remainingPaise;
          }

          remainingPaise -=
            splitAmountPaise;

          return {
            expense_id:
              expense.id,

            user_id:
              member.user_id,

            amount:
              splitAmountPaise /
              100,
          };
        },
      );

    // ====================================
    // INSERT SPLITS
    // ====================================

    const {
      error:
        splitError,
    } =
      await supabaseAdmin
        .from(
          "expense_splits",
        )
        .insert(
          splitRows,
        );

    // ====================================
    // ROLLBACK
    // ====================================

    if (splitError) {

      console.error(
        splitError,
      );

      // DELETE ORPHAN EXPENSE
      await supabaseAdmin
        .from("expenses")
        .delete()
        .eq(
          "id",
          expense.id,
        );

      return NextResponse.json(
        {
          error:
            "Failed to split expense",
        },
        { status: 500 },
      );
    }

    // ====================================
    // SUCCESS
    // ====================================

    return NextResponse.json({
      success: true,

      expense,
    });

  } catch (error: any) {

    console.error(
      "EXPENSE API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Server error",
      },
      { status: 500 },
    );
  }
}