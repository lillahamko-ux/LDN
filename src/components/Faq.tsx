const FAQS = [
  {
    q: "Who are the meetups for?",
    a: "Everyone — digital nomads, expats and locals. If you're new in Lisbon or just open to meeting new people, you're welcome.",
  },
  {
    q: "How do I join or find the next meetup?",
    a: "We meet every Thursday at a different venue. Join our Slack or follow us on Instagram to see where we're headed next — no signup or ticket needed.",
  },
  {
    q: "I'm coming alone and don't know anyone — is that okay?",
    a: "That's how most people arrive! Our hosts will welcome you and introduce you to others. Coming solo is the norm, not the exception.",
  },
  {
    q: "What actually happens at a meetup?",
    a: "People hang out, drink and chat. No agenda, no talks, no networking games — just casual conversation at a cool venue.",
  },
  {
    q: "What else do you run, and how can I get involved?",
    a: "Beyond Thursdays we run occasional day trips, dinners and activities. Join the Slack to hear about them — or volunteer to host!",
  },
  {
    q: "How much does it cost?",
    a: "Nothing. The meetups are free to attend — you only pay for whatever you drink or eat at the venue.",
  },
  {
    q: "Can I sponsor a meetup?",
    a: "We keep the meetups agenda-free, so we don't do traditional sponsorships — but venues can host us, and we're happy to chat about ideas that fit our vibe.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl font-semibold sm:text-5xl">
          Got questions?
        </h2>
        <p className="mt-1 font-script text-3xl text-ldn-indigo">
          we&apos;ve answers
        </p>
      </div>

      <div className="mt-12 divide-y divide-neutral-200">
        {FAQS.map((faq) => (
          <details key={faq.q} className="faq-item group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
              {faq.q}
              <svg
                viewBox="0 0 20 20"
                className="faq-chevron h-4 w-4 shrink-0 fill-none stroke-current stroke-2 transition-transform"
                aria-hidden
              >
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 pr-8 text-sm leading-relaxed text-neutral-600">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
