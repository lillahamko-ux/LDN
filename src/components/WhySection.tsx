import Image from "next/image";

const CARDS = [
  {
    title: "All are welcome",
    body: "Nomads, expats and locals. A safe, inclusive space, always. For people new in Lisbon and for locals open to try new things.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=80",
    alt: "People chatting at a rooftop meetup",
  },
  {
    title: "0 business cards",
    body: "Meet new people without an agenda. Find future friends, clients, teammates and partners over a casual drink.",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&auto=format&fit=crop&q=80",
    alt: "A crowd mingling at an outdoor gathering",
  },
  {
    title: "Nonprofit",
    body: "We're all volunteers and these events are not for profit.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
    alt: "A lively venue at night",
  },
];

export default function WhySection() {
  return (
    <section id="meetups" className="mx-auto max-w-7xl px-6 py-16 sm:px-12 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="lg:sticky lg:top-16 lg:self-start">
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Time to find your
            <br />
            people in <span className="font-script text-5xl sm:text-6xl">Lisboa</span>!
          </h2>
          <p className="mt-6 text-sm text-ldn-muted">
            weekly meetup every
            <br />
            Thursday since 2017
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-3xl bg-ldn-indigo p-4 text-white shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="px-2 pb-3 pt-5">
                <h3 className="font-display text-2xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
