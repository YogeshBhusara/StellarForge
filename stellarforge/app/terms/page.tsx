"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nasaTerms, termCategories } from "@/lib/nasaTerms";
import CopyButton from "@/components/CopyButton";

export default function TermsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof termCategories)[number]>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return nasaTerms.filter((t) => {
      const inCategory = category === "All" || t.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="shrink-0 space-y-2">
        <input
          id="term-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          aria-label="Search terms"
          autoFocus
          className="glass w-full rounded-xl px-4 py-3 font-sans text-base text-white placeholder:text-slate-500 outline-none focus:border-glow/50"
        />
        <div className="flex flex-wrap gap-1">
          {termCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 font-display text-xs font-medium uppercase tracking-wide ${
                category === c
                  ? "bg-cyan-400/15 text-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ term, definition, category: cat }) => (
            <article key={term} className="glass flex flex-col rounded-xl p-4">
              <p className="font-display text-[11px] uppercase tracking-wider text-slate-400">
                {cat}
              </p>
              <h2 className="font-display text-lg font-semibold text-glow">{term}</h2>
              <p className="mt-2 flex-1 text-[15px] leading-7 text-slate-200">{definition}</p>
              <div className="mt-3 flex items-center gap-2">
                <CopyButton text={term} label="Copy" />
                <Link
                  href={`/?term=${encodeURIComponent(term)}`}
                  className="rounded-md bg-cyan-400 px-2.5 py-1 font-display text-xs font-semibold text-slate-950"
                >
                  Add
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
