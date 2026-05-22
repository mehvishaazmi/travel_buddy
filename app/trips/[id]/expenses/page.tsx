"use client";

import type {
  RealtimeChannel,
} from "@supabase/supabase-js";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  useUser,
} from "@clerk/nextjs";

import { supabase } from "@/lib/supabase";

import type {
  Member,
  Expense,
  Settlement,
} from "@/types";

import Navbar from "@/components/Navbar";

import { Footer } from "@/components/Footer";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  Loader2,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";

declare global {

  interface Window {

    Razorpay: any;
  }
}

// ====================================
// LOCAL TYPES
// ====================================

type SettlementSuggestion = {
  payer_user_id: string;
  payer_name: string;

  receiver_user_id: string;
  receiver_name: string;

  amount: number;
};

export default function TripExpensesPage() {

  const params =
    useParams();

  const { user } =
    useUser();

  const tripId =
    params.id as string;

  const [members, setMembers] =
    useState<Member[]>([]);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [
    completedSettlements,
    setCompletedSettlements,
  ] = useState<
    Settlement[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Food");

  const [adding, setAdding] =
    useState(false);

  // ====================================
  // REALTIME
  // ====================================

  useEffect(() => {

    let channel:
      RealtimeChannel | null =
        null;

    if (tripId) {

      channel =
        supabase
          .channel(
            `trip-${tripId}`,
          )

          .on(
            "postgres_changes",
            {
              event: "*",
              schema:
                "public",
              table:
                "expenses",
              filter:
                `trip_id=eq.${tripId}`,
            },

            async () => {

              await fetchAll();
            },
          )

          .on(
            "postgres_changes",
            {
              event: "*",
              schema:
                "public",
              table:
                "trip_members",
              filter:
                `trip_id=eq.${tripId}`,
            },

            async () => {

              await fetchAll();
            },
          )

          .on(
            "postgres_changes",
            {
              event: "*",
              schema:
                "public",
              table:
                "settlements",
              filter:
                `trip_id=eq.${tripId}`,
            },

            async () => {

              await fetchAll();
            },
          )

          .subscribe();
    }

    return () => {

      if (channel) {

        supabase.removeChannel(
          channel,
        );
      }
    };

  }, [tripId]);

  // ====================================
  // INITIAL FETCH
  // ====================================

  useEffect(() => {

    if (user?.id) {

      fetchAll();
    }

  }, [user?.id]);

  // ====================================
  // FETCH ALL
  // ====================================

  async function fetchAll() {

    try {

      setLoading(true);

      // MEMBERS
      const {
        data:
          membersData,
      } = await supabase
        .from(
          "trip_members",
        )
        .select("*")
        .eq(
          "trip_id",
          tripId,
        );

      setMembers(
        (membersData ||
          []) as Member[],
      );

      // EXPENSES
      const {
        data:
          expensesData,
      } = await supabase
        .from(
          "expenses",
        )
        .select("*")
        .eq(
          "trip_id",
          tripId,
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        );

      setExpenses(
        (expensesData ||
          []) as Expense[],
      );

      // SETTLEMENTS
      const {
        data:
          settlementsData,
      } = await supabase
        .from(
          "settlements",
        )
        .select("*")
        .eq(
          "trip_id",
          tripId,
        );

      setCompletedSettlements(
        (settlementsData ||
          []) as Settlement[],
      );

    } catch (error) {

      console.error(
        error,
      );

      toast.error(
        "Failed to load expenses",
      );

    } finally {

      setLoading(false);
    }
  }

  // ====================================
  // ADD EXPENSE
  // ====================================

  async function addExpense() {

    try {

      if (
        !title.trim() ||
        !amount
      ) {

        toast.error(
          "Please fill all fields",
        );

        return;
      }

      setAdding(true);

      const response =
        await fetch(
          "/api/expenses",
          {
            method:
              "POST",

            headers:
              {
                "Content-Type":
                  "application/json",
              },

            body:
              JSON.stringify({
                trip_id:
                  tripId,

                title:
                  title.trim(),

                amount:
                  Number(
                    amount,
                  ),

                category,
              }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {

        toast.error(
          data.error ||
            "Failed to create expense",
        );

        return;
      }

      toast.success(
        "Expense added successfully!",
      );

      setTitle("");

      setAmount("");

      setCategory(
        "Food",
      );

      await fetchAll();

    } catch (error) {

      console.error(
        error,
      );

      toast.error(
        "Something went wrong",
      );

    } finally {

      setAdding(false);
    }
  }

  // ====================================
  // PAY SETTLEMENT
  // ====================================

  async function handleSettlementPayment(
    settlement:
      SettlementSuggestion,
  ) {

    try {

      // ====================================
      // CREATE ORDER
      // ====================================

      const orderRes =
        await fetch(
          "/api/create-order",
          {
            method:
              "POST",

            headers:
              {
                "Content-Type":
                  "application/json",
              },

            body:
              JSON.stringify({
                amount:
                  settlement.amount,

                trip_id:
                  tripId,

                receiver_user_id:
                  settlement.receiver_user_id,
              }),
          },
        );

      const order =
        await orderRes.json();

      if (!order.id) {

        toast.error(
          "Failed to create payment order",
        );

        return;
      }

      // ====================================
      // OPEN RAZORPAY
      // ====================================

      const razorpay =
        new window.Razorpay(
          {
            key:
              process.env
                .NEXT_PUBLIC_RAZORPAY_KEY_ID,

            amount:
              order.amount,

            currency:
              order.currency,

            name:
              "TravelBuddy",

            description:
              "Trip Settlement",

            order_id:
              order.id,

            theme: {
              color:
                "#06b6d4",
            },

            handler:
              async (
                response: any,
              ) => {

                const verifyRes =
                  await fetch(
                    "/api/verify-payment",
                    {
                      method:
                        "POST",

                      headers:
                        {
                          "Content-Type":
                            "application/json",
                        },

                      body:
                        JSON.stringify(
                          {
                            razorpay_order_id:
                              response.razorpay_order_id,

                            razorpay_payment_id:
                              response.razorpay_payment_id,

                            razorpay_signature:
                              response.razorpay_signature,

                            trip_id:
                              tripId,

                            receiver_user_id:
                              settlement.receiver_user_id,

                            receiver_name:
                              settlement.receiver_name,

                            amount:
                              settlement.amount,
                          },
                        ),
                    },
                  );

                const verifyData =
                  await verifyRes.json();

                if (
                  !verifyRes.ok
                ) {

                  toast.error(
                    verifyData.error ||
                      "Payment verification failed",
                  );

                  return;
                }

                toast.success(
                  "Settlement completed!",
                );

                await fetchAll();
              },
          },
        );

      razorpay.open();

    } catch (error) {

      console.error(
        error,
      );

      toast.error(
        "Payment failed",
      );
    }
  }

  // ====================================
  // TOTAL
  // ====================================

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense,
      ) =>
        sum +
        expense.amount,

      0,
    );

  // ====================================
  // BALANCES
  // ====================================

  const balances =
    useMemo(() => {

      const map:
        Record<
          string,
          {
            user_id: string;
            name: string;
            balance: number;
          }
        > = {};

      members.forEach(
        (
          member,
        ) => {

          map[
            member.user_id
          ] = {
            user_id:
              member.user_id,

            name:
              member.user_name,

            balance: 0,
          };
        },
      );

      expenses.forEach(
        (
          expense,
        ) => {

          const split =
            expense.amount /
            members.length;

          members.forEach(
            (
              member,
            ) => {

              if (
                member.user_id ===
                expense.paid_by
              ) {

                map[
                  member.user_id
                ].balance +=
                  expense.amount -
                  split;

              } else {

                map[
                  member.user_id
                ].balance -=
                  split;
              }
            },
          );
        },
      );

      return map;

    }, [
      expenses,
      members,
    ]);

  // ====================================
  // SETTLEMENTS
  // ====================================

  const settlements =
    useMemo(() => {

      const creditors:
        SettlementSuggestion[] =
          [];

      const debtors:
        SettlementSuggestion[] =
          [];

      Object.values(
        balances,
      ).forEach(
        (
          userBalance,
        ) => {

          if (
            userBalance.balance >
            0
          ) {

            creditors.push({
              payer_user_id:
                "",

              payer_name:
                "",

              receiver_user_id:
                userBalance.user_id,

              receiver_name:
                userBalance.name,

              amount:
                userBalance.balance,
            });

          } else if (
            userBalance.balance <
            0
          ) {

            debtors.push({
              payer_user_id:
                userBalance.user_id,

              payer_name:
                userBalance.name,

              receiver_user_id:
                "",

              receiver_name:
                "",

              amount:
                Math.abs(
                  userBalance.balance,
                ),
            });
          }
        },
      );

      const result:
        SettlementSuggestion[] =
          [];

      let i = 0;

      let j = 0;

      while (
        i <
          debtors.length &&
        j <
          creditors.length
      ) {

        const debtor =
          debtors[i];

        const creditor =
          creditors[j];

        const payAmount =
          Math.min(
            debtor.amount,
            creditor.amount,
          );

        // ====================================
        // ALREADY PAID
        // ====================================

        const alreadyPaid =
          completedSettlements.some(
            (
              settlementRecord,
            ) =>
              settlementRecord.payer_user_id ===
                debtor.payer_user_id &&
              settlementRecord.receiver_user_id ===
                creditor.receiver_user_id,
          );

        if (
          alreadyPaid
        ) {

          debtor.amount -=
            payAmount;

          creditor.amount -=
            payAmount;

          if (
            debtor.amount <=
            0
          )
            i++;

          if (
            creditor.amount <=
            0
          )
            j++;

          continue;
        }

        result.push({
          payer_user_id:
            debtor.payer_user_id,

          payer_name:
            debtor.payer_name,

          receiver_user_id:
            creditor.receiver_user_id,

          receiver_name:
            creditor.receiver_name,

          amount:
            payAmount,
        });

        debtor.amount -=
          payAmount;

        creditor.amount -=
          payAmount;

        if (
          debtor.amount <=
          0
        )
          i++;

        if (
          creditor.amount <=
          0
        )
          j++;
      }

      return result;

    }, [
      balances,
      completedSettlements,
    ]);

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <Loader2
          className="
            h-10
            w-10
            animate-spin
            text-cyan-500
          "
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">

      <Navbar />

      <main className="container pb-24 pt-28">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-5xl font-bold text-slate-900">

              Group Expenses 💸
            </h1>

            <p className="mt-3 text-lg text-slate-600">

              Split expenses with your travel group.
            </p>
          </div>

          <Dialog>

            <DialogTrigger asChild>

              <Button
                className="
                  rounded-2xl
                  bg-cyan-500
                  hover:bg-cyan-600
                "
              >

                <Plus className="mr-2 h-4 w-4" />

                Add Expense
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl">

              <DialogHeader>

                <DialogTitle>

                  Add Expense
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">

                <Input
                  placeholder="What was this expense for?"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value,
                    )
                  }
                  className="
                    h-14
                    rounded-2xl
                    border-slate-200
                    text-base
                  "
                />

                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value,
                    )
                  }
                />

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value,
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-3
                    text-sm
                  "
                >

                  <option>
                    Food
                  </option>

                  <option>
                    Hotel
                  </option>

                  <option>
                    Transport
                  </option>

                  <option>
                    Shopping
                  </option>

                  <option>
                    Activities
                  </option>

                  <option>
                    Other
                  </option>
                </select>

                <Button
                  onClick={
                    addExpense
                  }
                  disabled={
                    adding
                  }
                  className="
                    w-full
                    bg-cyan-500
                    hover:bg-cyan-600
                  "
                >

                  {adding
                    ? "Adding..."
                    : "Create Expense"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-2 text-slate-500">

              <Wallet className="h-5 w-5" />

              Total Expenses
            </div>

            <h2 className="mt-3 text-4xl font-bold">

              ₹
              {totalExpenses.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-2 text-slate-500">

              <Users className="h-5 w-5" />

              Members
            </div>

            <h2 className="mt-3 text-4xl font-bold">

              {members.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-2 text-slate-500">

              <Receipt className="h-5 w-5" />

              Expenses
            </div>

            <h2 className="mt-3 text-4xl font-bold">

              {expenses.length}
            </h2>
          </div>
        </div>

        {/* BALANCES */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-md">

          <h2 className="text-2xl font-bold text-slate-900">

            Balances
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {Object.values(
              balances,
            ).map(
              (
                userBalance,
              ) => (

                <div
                  key={
                    userBalance.user_id
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                  "
                >

                  <h3 className="text-lg font-semibold text-slate-900">

                    {
                      userBalance.name
                    }
                  </h3>

                  <p
                    className={`mt-2 text-xl font-bold ${
                      userBalance.balance >=
                      0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >

                    {userBalance.balance >=
                    0
                      ? "+"
                      : "-"}

                    ₹

                    {Math.abs(
                      userBalance.balance,
                    ).toFixed(
                      0,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* SETTLEMENTS */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-md">

          <h2 className="text-2xl font-bold text-slate-900">

            Settlement Suggestions
          </h2>

          <div className="mt-6 space-y-4">

            {settlements.length ===
            0 ? (

              <p className="text-slate-500">

                All balances settled 🎉
              </p>

            ) : (

              settlements.map(
                (
                  settlement,
                  index,
                ) => (

                  <div
                    key={
                      index
                    }
                    className="
                      flex
                      flex-col
                      gap-4
                      rounded-2xl
                      border
                      border-slate-200
                      p-5
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >

                    <div>

                      <p className="text-lg font-semibold text-slate-900">

                        {
                          settlement.payer_name
                        }
                      </p>

                      <p className="text-sm text-slate-500">

                        owes{" "}

                        {
                          settlement.receiver_name
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <p className="text-2xl font-bold text-cyan-600">

                        ₹

                        {settlement.amount.toFixed(
                          0,
                        )}
                      </p>

                      <Button
                        onClick={() =>
                          handleSettlementPayment(
                            settlement,
                          )
                        }
                        className="
                          bg-cyan-500
                          hover:bg-cyan-600
                        "
                      >

                        Settle Up
                      </Button>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>

        {/* EXPENSE FEED */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-md">

          <h2 className="text-2xl font-bold text-slate-900">

            Expense Feed
          </h2>

          <div className="mt-6 space-y-4">

            {expenses.length ===
            0 ? (

              <p className="text-slate-500">

                No expenses yet
              </p>

            ) : (

              expenses.map(
                (
                  expense,
                ) => (

                  <div
                    key={
                      expense.id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-slate-200
                      p-5
                    "
                  >

                    <div>

                      <h3 className="text-lg font-semibold text-slate-900">

                        {
                          expense.title
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">

                        Paid by{" "}

                        {
                          expense.paid_by_name
                        }
                      </p>

                      <div
                        className="
                          mt-2
                          inline-flex
                          rounded-full
                          bg-cyan-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-cyan-700
                        "
                      >

                        {expense.category ||
                          "Other"}
                      </div>
                    </div>

                    <div className="text-right">

                      <p className="text-2xl font-bold text-slate-900">

                        ₹

                        {expense.amount.toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">

                        {new Date(
                          expense.created_at ||
                            "",
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}