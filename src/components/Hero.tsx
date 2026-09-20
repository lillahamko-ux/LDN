import Image from "next/image";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&auto=format&fit=crop&q=80";
const VIDEO_THUMB =
  "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&auto=format&fit=crop&q=80";

export default function Hero() {
  return (
    <section className="p-3 sm:p-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ldn-ink">
        <Image
          src={HERO_IMAGE}
          alt="Friends together at sunset in Lisbon"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <div className="relative flex min-h-[70vh] flex-col justify-between px-6 py-10 sm:px-12 sm:py-14">
          <h1 className="font-display text-5xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
            <span className="block">Lisbon</span>
            <span className="block pl-[0.6em]">Digital</span>
            <span className="block pl-[0.3em]">Nomads</span>
          </h1>

          <div className="mt-10 flex justify-end">
            <a
              href="#meetups"
              className="group flex items-end gap-4 text-right text-white"
            >
              <div>
                <p className="font-script text-3xl leading-none">press play</p>
                <p className="mt-1 max-w-[18ch] text-xs text-white/80">
                  see what our meetups are about
                </p>
              </div>
              <span className="relative block h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-white/30 shadow-lg">
                <Image
                  src={VIDEO_THUMB}
                  alt="Preview of a Lisbon Digital Nomads meetup video"
                  fill
                  sizes="144px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-0.5 h-4 w-4 fill-ldn-ink"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
