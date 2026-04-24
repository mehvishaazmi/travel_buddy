const steps = [
  { n: "01", title: "Tell us your dream", desc: "Share where you'd love to go, your vibe, and your dates." },
  { n: "02", title: "Match your buddies", desc: "We connect you with verified travelers heading the same way." },
  { n: "03", title: "Plan together", desc: "Co-create your itinerary with smart suggestions and shared notes." },
  { n: "04", title: "Travel & split", desc: "Enjoy the trip — track expenses and settle up in one tap." },
];

export const HowItWorks = () => {
  return (
    <section id="buddies" className="py-24 sm:py-32">
      <div className="container">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
            How it works
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            From dream to departure in <span className="text-gradient">four simple steps</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-3xl bg-card border border-border/50 p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth h-full">
                <div className="font-display text-5xl font-bold text-gradient">{s.n}</div>
                <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
