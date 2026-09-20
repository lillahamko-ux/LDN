import Image from "next/image";

const VENUES = [
  {
    name: "Intenso",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Comoba",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Tribe Social Club",
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Sunset Destination Hostel",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=700&auto=format&fit=crop&q=80",
  },
];

export default function Venues() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-script text-3xl text-ldn-indigo">Go Explore!</p>
        <h2 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Discover cool spots all across Lisbon
        </h2>
        <p className="mt-4 text-sm text-ldn-muted">
          Every Thursday we host at a different venue
        </p>
      </div>

      <div className="mt-12 flex gap-4 overflow-x-auto px-6 pb-4 sm:px-12">
        {VENUES.map((venue, i) => (
          <figure
            key={venue.name}
            className="relative aspect-[4/3] w-64 shrink-0 overflow-hidden rounded-2xl sm:w-72"
          >
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              sizes="288px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-semibold text-ldn-ink">
              {i + 1}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-sm font-medium text-white">
              {venue.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
