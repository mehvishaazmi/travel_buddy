import { Compass, Globe, MessagesSquare } from "lucide-react";

const cols = [
  { title: "Product", links: ["Discover", "Trips", "Buddies", "Itineraries", "Pricing"] },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Help center", "Travel guides", "Community", "Blog"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero shadow-glow">
                <Compass className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold">TravelBuddy</span>
            </a>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Discover trips, find travel buddies, and plan unforgettable adventures together.
            </p>

            <div className="mt-5 flex gap-2">
              {[Globe, MessagesSquare, Compass].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-secondary transition-smooth hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-sm font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-smooth hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TravelBuddy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with ♥ for travelers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};