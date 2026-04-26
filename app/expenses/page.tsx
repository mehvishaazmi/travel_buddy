"use client";
import { useMemo, useState } from "react";
import {
  Plus,
  Receipt,
  Users,
  ArrowRight,
  Check,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  Wallet,
  X,
  Send,
  CreditCard,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  initials: string;
  gradient: string;
};

type Expense = {
  id: string;
  description: string;
  category: string;
  amount: number;
  paidBy: string; // member id
  date: string;
  splitWith: string[]; // member ids
};

const members: Member[] = [
  { id: "u1", name: "You", initials: "YO", gradient: "from-primary to-primary-glow" },
  { id: "u2", name: "Sara", initials: "SR", gradient: "from-accent to-primary" },
  { id: "u3", name: "Jamal", initials: "JK", gradient: "from-primary-glow to-accent" },
  { id: "u4", name: "Elif", initials: "EN", gradient: "from-primary to-accent" },
];

const initialExpenses: Expense[] = [
  {
    id: "e1",
    description: "Villa booking · 3 nights",
    category: "Stay",
    amount: 480,
    paidBy: "u1",
    date: "Mar 12",
    splitWith: ["u1", "u2", "u3", "u4"],
  },
  {
    id: "e2",
    description: "Scooter rentals",
    category: "Transport",
    amount: 120,
    paidBy: "u2",
    date: "Mar 13",
    splitWith: ["u1", "u2", "u3", "u4"],
  },
  {
    id: "e3",
    description: "Group dinner · Ubud",
    category: "Food",
    amount: 92,
    paidBy: "u3",
    date: "Mar 14",
    splitWith: ["u1", "u2", "u3", "u4"],
  },
  {
    id: "e4",
    description: "Snorkeling tour",
    category: "Activity",
    amount: 200,
    paidBy: "u4",
    date: "Mar 15",
    splitWith: ["u1", "u2", "u3", "u4"],
  },
];

const categories = ["Stay", "Food", "Transport", "Activity", "Shopping", "Other"];

const categoryColors: Record<string, string> = {
  Stay: "bg-primary/10 text-primary",
  Food: "bg-accent/15 text-accent",
  Transport: "bg-primary-glow/15 text-primary",
  Activity: "bg-secondary text-foreground/70",
  Shopping: "bg-accent/10 text-accent",
  Other: "bg-muted text-muted-foreground",
};

const memberById = (id: string) => members.find((m) => m.id === id)!;

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [open, setOpen] = useState(false);

  // form state
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("u1");
  const [category, setCategory] = useState("Food");

  // Compute net balance per member
  const balances = useMemo(() => {
    const net: Record<string, number> = Object.fromEntries(
      members.map((m) => [m.id, 0])
    );
    for (const e of expenses) {
      const share = e.amount / e.splitWith.length;
      net[e.paidBy] += e.amount;
      for (const id of e.splitWith) net[id] -= share;
    }
    return net;
  }, [expenses]);

  // Greedy settlement: who owes whom
  const settlements = useMemo(() => {
    const debtors = Object.entries(balances)
      .filter(([, v]) => v < -0.01)
      .map(([id, v]) => ({ id, amt: -v }))
      .sort((a, b) => b.amt - a.amt);
    const creditors = Object.entries(balances)
      .filter(([, v]) => v > 0.01)
      .map(([id, v]) => ({ id, amt: v }))
      .sort((a, b) => b.amt - a.amt);

    const result: { from: string; to: string; amount: number }[] = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      result.push({ from: debtors[i].id, to: creditors[j].id, amount: pay });
      debtors[i].amt -= pay;
      creditors[j].amt -= pay;
      if (debtors[i].amt < 0.01) i++;
      if (creditors[j].amt < 0.01) j++;
    }
    return result;
  }, [balances]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const yourShare = expenses.reduce(
    (s, e) => s + (e.splitWith.includes("u1") ? e.amount / e.splitWith.length : 0),
    0
  );
  const yourNet = balances["u1"] ?? 0;

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!desc.trim() || !value || value <= 0) {
      toast.error("Add a description and amount");
      return;
    }
    const newExpense: Expense = {
      id: `e${Date.now()}`,
      description: desc.trim(),
      category,
      amount: value,
      paidBy,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      splitWith: members.map((m) => m.id),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setDesc("");
    setAmount("");
    setOpen(false);
    toast.success("Expense added", { description: `${desc} · $${value.toFixed(2)}` });
  };

  const handleSettle = (from: string, to: string, amt: number) => {
    const settlement: Expense = {
      id: `s${Date.now()}`,
      description: `Settlement · ${memberById(from).name} → ${memberById(to).name}`,
      category: "Other",
      amount: amt,
      paidBy: from,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      splitWith: [to],
    };
    setExpenses((prev) => [settlement, ...prev]);
    toast.success("Marked as settled", {
      description: `$${amt.toFixed(2)} from ${memberById(from).name} to ${memberById(to).name}`,
    });
  };

  const Avatar = ({ id, size = "md" }: { id: string; size?: "sm" | "md" | "lg" }) => {
    const m = memberById(id);
    const sizes = {
      sm: "h-7 w-7 text-[10px]",
      md: "h-10 w-10 text-xs",
      lg: "h-12 w-12 text-sm",
    };
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br grid place-items-center text-primary-foreground font-semibold shadow-glow shrink-0",
          sizes[size],
          m.gradient
        )}
      >
        {m.initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Group overview */}
      <section className="pt-28 pb-10 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                Group expenses
              </span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                Bali Buddy Trip
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Mar 12 – 22, 2025
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {members.length} members
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Receipt className="h-4 w-4" /> {expenses.length} expenses
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {members.map((m) => (
                  <div key={m.id} className="ring-2 ring-background rounded-full">
                    <Avatar id={m.id} size="md" />
                  </div>
                ))}
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="lg" className="rounded-xl shadow-glow">
                    <Plus className="h-5 w-5" /> Add expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[460px] rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      Add an expense
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="e.g. Dinner at warung"
                        className="mt-1.5 h-11 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Amount
                        </Label>
                        <div className="relative mt-1.5">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="pl-7 h-11 rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Category
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Paid by
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {members.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setPaidBy(m.id)}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-smooth",
                              paidBy === m.id
                                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                                : "bg-secondary/60 border-transparent hover:bg-secondary"
                            )}
                          >
                            <Avatar id={m.id} size="sm" />
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3">
                      Split equally between all {members.length} members.
                    </div>
                  </div>
                  <DialogFooter className="mt-2">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button variant="hero" onClick={handleAdd} className="rounded-xl">
                      Add expense
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wallet className="h-4 w-4" /> Total spent
              </div>
              <div className="mt-2 font-display text-3xl font-bold tracking-tight">
                ${total.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                across {expenses.length} expenses
              </div>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Receipt className="h-4 w-4" /> Your share
              </div>
              <div className="mt-2 font-display text-3xl font-bold tracking-tight">
                ${yourShare.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((yourShare / Math.max(total, 1)) * 100).toFixed(0)}% of total
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl border p-5 shadow-soft",
                yourNet >= 0
                  ? "bg-primary/5 border-primary/30"
                  : "bg-accent/5 border-accent/30"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
                  yourNet >= 0 ? "text-primary" : "text-accent"
                )}
              >
                {yourNet >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {yourNet >= 0 ? "You're owed" : "You owe"}
              </div>
              <div className="mt-2 font-display text-3xl font-bold tracking-tight">
                ${Math.abs(yourNet).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Net balance after all splits
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="pb-24">
        <div className="container grid lg:grid-cols-[1.5fr_1fr] gap-6">
          {/* Expense list */}
          <div className="rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> Expenses
              </h2>
              <span className="text-xs text-muted-foreground">Most recent first</span>
            </div>

            <ul className="divide-y divide-border/60">
              {expenses.map((e) => {
                const payer = memberById(e.paidBy);
                const share = e.amount / e.splitWith.length;
                const youOweThis = e.paidBy !== "u1" && e.splitWith.includes("u1");
                return (
                  <li
                    key={e.id}
                    className="p-5 flex items-center gap-4 hover:bg-secondary/30 transition-smooth"
                  >
                    <span
                      className={cn(
                        "grid place-items-center h-11 w-11 rounded-xl shrink-0",
                        categoryColors[e.category] ?? categoryColors.Other
                      )}
                    >
                      <Tag className="h-4 w-4" />
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{e.description}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Avatar id={e.paidBy} size="sm" />
                          {payer.name} paid
                        </span>
                        <span>·</span>
                        <span>{e.date}</span>
                        <span>·</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-foreground/70 text-[10px] font-medium">
                          {e.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display text-lg font-bold tabular-nums">
                        ${e.amount.toFixed(2)}
                      </div>
                      <div
                        className={cn(
                          "text-[11px] font-medium tabular-nums",
                          youOweThis ? "text-accent" : "text-muted-foreground"
                        )}
                      >
                        {youOweThis
                          ? `you owe $${share.toFixed(2)}`
                          : e.paidBy === "u1"
                          ? `split / person $${share.toFixed(2)}`
                          : `split equally`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => setOpen(true)}
              className="w-full p-4 border-t border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-smooth flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add another expense
            </button>
          </div>

          {/* Right column: balances + settlements */}
          <div className="space-y-6">
            {/* Balance summary */}
            <div className="rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-border/60">
                <h2 className="font-display text-lg font-semibold">Balance summary</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Net balance for each member
                </p>
              </div>
              <ul className="divide-y divide-border/60">
                {members.map((m) => {
                  const net = balances[m.id];
                  const positive = net >= 0;
                  return (
                    <li key={m.id} className="p-4 flex items-center gap-3">
                      <Avatar id={m.id} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.abs(net) < 0.01
                            ? "all settled"
                            : positive
                            ? "gets back"
                            : "owes"}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "font-display text-base font-bold tabular-nums",
                          Math.abs(net) < 0.01
                            ? "text-muted-foreground"
                            : positive
                            ? "text-primary"
                            : "text-accent"
                        )}
                      >
                        {positive ? "+" : "-"}${Math.abs(net).toFixed(2)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Settlements */}
            <div className="rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-border/60 gradient-soft">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Settle up
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simplest way to clear all balances
                </p>
              </div>

              {settlements.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="grid mx-auto place-items-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <Check className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-semibold">All settled up</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No one owes anything right now.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {settlements.map((s, i) => (
                    <li key={i} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar id={s.from} size="md" />
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Avatar id={s.to} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">
                            <span className="font-semibold">
                              {memberById(s.from).name}
                            </span>{" "}
                            <span className="text-muted-foreground">pays</span>{" "}
                            <span className="font-semibold">
                              {memberById(s.to).name}
                            </span>
                          </div>
                          <div className="font-display text-lg font-bold text-gradient tabular-nums">
                            ${s.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="hero"
                          className="flex-1 rounded-xl"
                          onClick={() => handleSettle(s.from, s.to, s.amount)}
                        >
                          <Check className="h-4 w-4" /> Mark settled
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() =>
                            toast.success("Reminder sent", {
                              description: `${memberById(s.from).name} was nudged.`,
                            })
                          }
                        >
                          <Send className="h-4 w-4" /> Remind
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Expenses;
