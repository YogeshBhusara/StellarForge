"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nasaTerms, termCategories } from "@/lib/nasaTerms";
import PageHeader from "@/components/PageHeader";
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
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Term Explorer"
        description="NASA and spaceflight terms you can copy or send straight into Write Studio."
      />
      <div className="space-y-3">
        <label htmlFor="term-search" className="sr-only">
          Search terms
        </label>
        <input
          id="term-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-2.5 font-mono text-white placeholder-slate-500 outline-none transition-all focus:border-glow focus:ring-2 focus:ring-glow/20"
        />
        <div className="flex flex-wrap gap-2">
          {termCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 font-mono text-xs ${
                category === c
                  ? "bg-cyan-600/30 text-glow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-500">
          {filtered.length} term{filtered.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(({ term, definition, category: cat }) => (
          <article
            key={term}
            className="flex flex-col rounded-lg border border-slate-700/50 bg-slate-900/50 p-4 transition-all hover:border-glow/30 hover:shadow-glow-sm"
          >
            <p className="font-mono text-[10px] uppercase tracking-wide text-slate-500">
              {cat}
            </p>
            <h2 className="mt-1 font-mono font-semibold text-glow">{term}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{definition}</p>
            <div className="mt-4 flex items-center gap-2">
              <CopyButton text={term} label="Copy term" />
              <Link
                href={`/write?term=${encodeURIComponent(term)}`}
                className="rounded border border-slate-600 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-glow/50 hover:text-glow"
              >
                Use in story
              </Link>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-mono text-slate-500">No terms match your search.</p>
      )}
    </div>
  );
}
