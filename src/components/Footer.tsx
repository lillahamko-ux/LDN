const COLUMNS = [
  {
    heading: "LDN",
    links: ["About", "Meetups", "Home"],
  },
  {
    heading: "Join",
    links: ["Venue application", "Join our team", "Contact"],
  },
  {
    heading: "Connect",
    links: ["Instagram", "Facebook", "Slack"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ldn-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-12">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex flex-wrap gap-16">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="text-sm font-semibold">{col.heading}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="grid h-20 w-20 grid-cols-5 grid-rows-5 gap-0.5 rounded-md bg-white p-1.5">
              {[
                1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1,
                1, 0, 1, 1,
              ].map((on, i) => (
                <span
                  key={i}
                  className={on ? "bg-ldn-ink" : "bg-transparent"}
                />
              ))}
            </span>
            <p className="text-xs text-white/60">Join our Slack</p>
          </div>
        </div>

        <p className="mt-12 text-xs text-white/40">
          © 2025 Lisbon Digital Nomads · All rights reserved
        </p>
      </div>
    </footer>
  );
}
