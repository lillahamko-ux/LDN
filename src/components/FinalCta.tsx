import Image from "next/image";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1800&auto=format&fit=crop&q=80";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ldn-ink text-white">
      <Image
        src={CTA_IMAGE}
        alt="Friends toasting with drinks at golden hour"
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

      <div className="relative mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Come solo, leave with
          <br />
          new <span className="font-script text-5xl sm:text-6xl">friends</span>!
        </h2>
        <a
          href="#meetups"
          className="mt-8 rounded-full bg-ldn-indigo px-6 py-3 text-sm font-medium transition-colors hover:bg-ldn-indigo-deep"
        >
          Discover meetups
        </a>
      </div>
    </section>
  );
}
