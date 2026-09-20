import Image from "next/image";

const CARDS = [
  {
    title: "For Venues",
    body: "Host us on a Thursday and we'll bring you a Saturday-sized crowd — €1,000–€2,000+ at the bar.",
    cta: "Learn more",
    href: "#venues",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80",
    alt: "Bartender serving guests at a busy bar",
  },
  {
    title: "Join our Team",
    body: "We're looking for warm, organized humans to host our meetups.",
    cta: "Learn more",
    href: "#team",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&auto=format&fit=crop&q=80",
    alt: "Meetup hosts working together",
  },
];

export default function GetInvolved() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-12 sm:pb-24">
      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map((card) => (
          <article
            key={card.title}
            className="relative min-h-[26rem] overflow-hidden rounded-3xl bg-ldn-ink text-white"
          >
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
            <div className="relative flex h-full min-h-[26rem] flex-col justify-between p-8">
              <div>
                <h3 className="font-display text-3xl font-semibold">{card.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                  {card.body}
                </p>
              </div>
              <a
                href={card.href}
                className="mt-8 w-fit rounded-full bg-ldn-indigo px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ldn-indigo-deep"
              >
                {card.cta}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
