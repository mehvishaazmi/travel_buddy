import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I met my hiking crew through TravelBuddy and we've now done three trips together. Splitting costs was effortless.",
    name: "Mira Patel",
    role: "Solo traveler · 14 trips",
    initials: "MP",
  },
  {
    quote: "The AI itinerary saved me hours. It actually picked the cafés I'd choose myself. Felt like a local guide in my pocket.",
    name: "Lucas Bernard",
    role: "Photographer · Paris",
    initials: "LB",
  },
  {
    quote: "Best travel app I've used in years. The design is beautiful, and the buddy matching just works.",
    name: "Aiko Tanaka",
    role: "Designer · Tokyo",
    initials: "AT",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 sm:py-32 gradient-soft">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Loved worldwide
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Trusted by <span className="text-gradient">120,000+ travelers</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="rounded-3xl bg-card border border-border/50 p-7 shadow-soft hover:shadow-card transition-smooth animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground/80 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full gradient-hero grid place-items-center text-primary-foreground font-semibold text-sm shadow-glow">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
