import { Compass, Users, Map, Wallet, Sparkles, Shield } from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Discover trips",
    desc: "Curated journeys from solo adventures to group expeditions, tailored to your vibe.",
    color: "from-primary to-primary-glow",
  },
  {
    icon: Users,
    title: "Match with buddies",
    desc: "Find verified travel companions who share your destinations, dates, and interests.",
    color: "from-accent to-accent",
  },
  {
    icon: Map,
    title: "Smart itineraries",
    desc: "AI builds day-by-day plans with the best stays, eats, and hidden gems.",
    color: "from-primary-glow to-primary",
  },
  {
    icon: Wallet,
    title: "Split expenses",
    desc: "Track every shared cost and settle up instantly — no awkward math required.",
    color: "from-accent to-primary",
  },
  {
    icon: Sparkles,
    title: "Local experiences",
    desc: "Book unique tours and activities, hand-picked by locals you can trust.",
    color: "from-primary to-accent",
  },
  {
    icon: Shield,
    title: "Travel safely",
    desc: "ID-verified profiles, live location sharing, and 24/7 support wherever you go.",
    color: "from-primary-glow to-accent",
  },
];

export const Features = () => {
  return (
    <section id="trips" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] gradient-mesh opacity-60 -z-10" />

      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.12em]">
            Why TravelBuddy
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.025em] leading-[1.05] text-balance">
            Everything you need for the
            <span className="text-gradient"> perfect trip</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground text-pretty">
            From inspiration to itinerary to splitting the bill — we've got every step covered.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative card-premium p-8 overflow-hidden"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Hover gradient wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              <div className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-glow transition-bounce group-hover:scale-110 group-hover:rotate-3`}>
                <f.icon className="h-7 w-7 text-primary-foreground" strokeWidth={2} />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="relative mt-2 text-muted-foreground leading-relaxed">{f.desc}</p>

              {/* Subtle arrow on hover */}
              <div className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
