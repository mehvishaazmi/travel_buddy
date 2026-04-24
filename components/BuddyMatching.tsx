import { Button } from "@/components/ui/button";
import { BadgeCheck, Heart, MessageCircle } from "lucide-react";

const buddies = [
  {
    initials: "SR",
    name: "Sara Reyes",
    age: 27,
    city: "Lisbon, PT",
    match: 96,
    interests: ["Hiking", "Photography", "Foodie"],
    trip: "Bali · Mar 12 – 22",
    gradient: "from-primary to-primary-glow",
  },
  {
    initials: "JK",
    name: "Jamal Khan",
    age: 31,
    city: "Toronto, CA",
    match: 92,
    interests: ["Surfing", "Coffee", "Slow travel"],
    trip: "Bali · Mar 14 – 24",
    gradient: "from-accent to-primary",
  },
  {
    initials: "EN",
    name: "Elif Nazari",
    age: 25,
    city: "Berlin, DE",
    match: 89,
    interests: ["Yoga", "Art", "Local markets"],
    trip: "Bali · Mar 10 – 20",
    gradient: "from-primary-glow to-accent",
  },
];

export const BuddyMatching = () => {
  return (
    <section id="buddies" className="py-24 sm:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              Buddy matching
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Travel with people who <span className="text-gradient">just get it</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Our compatibility engine matches you with verified travelers by destination, dates, pace, and interests — so every trip feels effortless.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-foreground/70">
              <BadgeCheck className="h-5 w-5 text-primary" />
              ID-verified profiles · 4.9★ average rating
            </div>
            <Button variant="hero" size="lg" className="mt-8">
              Find my buddies
            </Button>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
            {buddies.map((b, i) => (
              <article
                key={b.name}
                className={`group rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth ${
                  i === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${b.gradient} grid place-items-center text-primary-foreground font-bold shadow-glow`}>
                      {b.initials}
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card grid place-items-center">
                        <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                      </span>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-lg">
                        {b.name}, <span className="text-muted-foreground font-normal">{b.age}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{b.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-gradient">{b.match}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">match</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {b.interests.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground/70">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Heading to <span className="font-semibold text-foreground">{b.trip}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-smooth">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
