const REVIEWS = [
  {
    name: "Marta",
    context: "Arroios & Alcântara · Weekly Lisbon Digital Nomads Meetup",
    stars: 5,
    when: "9 months ago",
    text: "Came alone on my first Thursday in Lisbon and left with a group chat and weekend plans. Exactly what a meetup should be.",
  },
  {
    name: "Jonas",
    context: "Cais do Sodré · Weekly Lisbon Digital Nomads Meetup",
    stars: 5,
    when: "5 months ago",
    text: "No name tags, no pitches, just good people and great venues. I've met half my Lisbon friends here.",
  },
  {
    name: "Priya",
    context: "Príncipe Real · Weekly Lisbon Digital Nomads Meetup",
    stars: 4,
    when: "2 months ago",
    text: "Warm hosts who actually introduce you to people. Gets busy, so come early if you want a quieter chat.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < count ? "fill-current" : "fill-neutral-200"}`}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-12 sm:py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl font-semibold sm:text-5xl">
          The love is real
        </h2>
        <p className="mt-3 text-sm text-ldn-muted">4.8 · 9465 ratings</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review) => (
          <article
            key={review.name}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <header className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="mt-0.5 text-xs text-ldn-indigo">{review.context}</p>
              </div>
            </header>
            <div className="mt-3 flex items-center gap-2">
              <Stars count={review.stars} />
              <span className="text-xs text-ldn-muted">{review.when}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {review.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
