import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, Wallet, CheckCircle2 } from "lucide-react";

const expenses = [
  { who: "You", what: "Villa booking · 3 nights", amount: 480, paidBy: "You", split: 4 },
  { who: "Sara", what: "Scooter rentals", amount: 120, paidBy: "Sara", split: 4 },
  { who: "Jamal", what: "Group dinner · Ubud", amount: 92, paidBy: "Jamal", split: 4 },
];

const balances = [
  { from: "Sara", to: "You", amount: 90 },
  { from: "Jamal", to: "You", amount: 90 },
  { from: "Elif", to: "Sara", amount: 30 },
];

export const ExpenseSplit = () => {
  return (
    <section className="py-24 sm:py-32 gradient-soft">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mock UI */}
          <div className="order-2 lg:order-1 space-y-4">
            <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-border/60">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Receipt className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display font-semibold">Bali trip · 4 people</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Total spent · $692</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">Active</span>
              </div>
              <ul className="divide-y divide-border/60">
                {expenses.map((e) => (
                  <li key={e.what} className="p-5 flex items-center gap-4">
                    <span className="h-9 w-9 rounded-full gradient-hero grid place-items-center text-primary-foreground text-xs font-semibold shrink-0">
                      {e.paidBy[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.what}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Paid by {e.paidBy} · split between {e.split}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${e.amount}</div>
                      <div className="text-xs text-muted-foreground">${e.amount / e.split}/ea</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wallet className="h-3.5 w-3.5 text-primary" />
                Who owes whom
              </div>
              <ul className="mt-4 space-y-3">
                {balances.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60">
                    <span className="h-8 w-8 rounded-full bg-card grid place-items-center text-xs font-semibold border border-border/60">
                      {b.from[0]}
                    </span>
                    <span className="text-sm font-medium">{b.from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="h-8 w-8 rounded-full gradient-hero grid place-items-center text-xs font-semibold text-primary-foreground">
                      {b.to[0]}
                    </span>
                    <span className="text-sm font-medium">{b.to}</span>
                    <span className="ml-auto font-semibold text-sm text-primary">${b.amount}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="mt-5 w-full rounded-2xl">
                <CheckCircle2 className="h-4 w-4" />
                Settle up
              </Button>
            </div>
          </div>

          {/* Pitch */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
              Expense splitting
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              No more <span className="text-gradient">awkward math</span> at dinner
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Log expenses on the go in any currency. We auto-calculate who owes whom and let you settle up in one tap — friendships intact.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Multi-currency · auto FX conversion",
                "Smart splits: equal, custom, by share",
                "One-tap payback via your favorite app",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
