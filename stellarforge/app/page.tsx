import Link from "next/link";

const features = [
  {
    title: "Scientific Scene Enhancement",
    description:
      "Improve your prose with real NASA terminology and plausible physics.",
    href: "/write",
    kicker: "01",
  },
  {
    title: "NASA Terminology Explorer",
    description: "Browse and search spaceflight terms, then drop them into a scene.",
    href: "/terms",
    kicker: "02",
  },
  {
    title: "Realism Analyzer",
    description: "Get a plausibility score and mission-science feedback on your text.",
    href: "/realism",
    kicker: "03",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="py-12 text-center sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-glow">
          Mission writing console
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Write Science Fiction Like Mission Control
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Ground your imagination in real NASA science
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/write"
            className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-mono font-medium text-white shadow-glow transition-all hover:from-cyan-400 hover:to-blue-500"
          >
            Go to Write Studio
          </Link>
          <Link
            href="/terms"
            className="inline-block rounded-lg border border-slate-600 px-6 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-glow/50 hover:text-glow"
          >
            Browse terms
          </Link>
        </div>
      </section>

      <section className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:border-glow/30 hover:shadow-glow-sm"
          >
            <p className="font-mono text-xs text-slate-500">{f.kicker}</p>
            <h2 className="mt-2 font-mono text-lg font-semibold text-white group-hover:text-glow">
              {f.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
