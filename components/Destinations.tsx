import { Star, MapPin, ArrowUpRight, Heart } from "lucide-react";

const destinations = [
  {
    img: "/dest-santorini.jpg",
    name: "Santorini",
    country: "Greece",
    price: "$1,240",
    rating: 4.9,
    trips: 128,
    tag: "Romantic",
  },
  {
    img: "/dest-bali.jpg",
    name: "Ubud",
    country: "Bali, Indonesia",
    price: "$890",
    rating: 4.8,
    trips: 214,
    tag: "Wellness",
  },
  {
    img: "/dest-tokyo.jpg",
    name: "Tokyo",
    country: "Japan",
    price: "$1,560",
    rating: 4.9,
    trips: 96,
    tag: "Culture",
  },
  {
    img: "/dest-swiss.jpg",
    name: "Zermatt",
    country: "Switzerland",
    price: "$1,820",
    rating: 4.9,
    trips: 73,
    tag: "Adventure",
  },
];

export const Destinations = () => {
  return (
    <section
      id="discover"
      className="relative overflow-hidden py-24 sm:py-32 gradient-soft"
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="container relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Trending now
            </span>

            <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Destinations <span className="text-gradient">made for memories</span>
            </h2>

            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Hand-picked, traveler-approved spots — with verified reviews and
              live trip groups.
            </p>
          </div>

          <a
            href="#"
            className="story-link inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary sm:self-end"
          >
            View all destinations
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <article
              key={d.name}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={d.img}
                  alt={`${d.name}, ${d.country}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />

                <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                  <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {d.rating}
                  </div>

                  <button
                    className="grid h-9 w-9 place-items-center rounded-full glass text-foreground transition-bounce hover:scale-110 hover:text-accent"
                    aria-label="Save"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute left-4 top-16 -translate-y-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {d.tag}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <MapPin className="h-3 w-3" />
                    {d.country}
                  </div>

                  <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                    {d.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs opacity-80">from </span>
                      <span className="text-base font-bold">{d.price}</span>
                    </div>
                    <span className="text-xs opacity-80">{d.trips} trips</span>
                  </div>

                  <div className="mt-4 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-12">
                    <div className="flex items-center gap-1.5 pt-1 text-sm font-semibold text-white">
                      Explore trip
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};