"use client";

import { useMemo, useState } from "react";
import { nasaTerms, termCategories, type NasaTerm } from "@/lib/nasaTerms";

interface TermExplorerPanelProps {
  onAddTerm: (term: string) => void;
  lastAdded?: string | null;
}

function TermRow({
  term,
  definition,
  category,
  onAdd,
  justAdded,
}: NasaTerm & { onAdd: () => void; justAdded: boolean }) {
  const [showDef, setShowDef] = useState(false);
  return (
    <div className="rounded-lg border border-cyan-200/10 bg-white/[0.03] p-3 transition hover:border-glow/30">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowDef((s) => !s)}
          className="flex-1 text-left"
          aria-expanded={showDef}
        >
          <span className="block font-display text-[15px] font-semibold text-glow">{term}</span>
          <span className="mt-0.5 block font-display text-[11px] uppercase tracking-wider text-slate-400">
            {category}
          </span>
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-md bg-cyan-500/90 px-2.5 py-1 font-display text-xs font-semibold text-slate-950 hover:bg-cyan-400"
        >
          {justAdded ? "Added" : "Add"}
        </button>
      </div>
      {showDef && (
        <p className="mt-2 text-sm leading-6 text-slate-300">{definition}</p>
      )}
    </div>
  );
}

export default function TermExplorerPanel({
  onAddTerm,
  lastAdded,
}: TermExplorerPanelProps) {
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
    <div className="glass flex h-full min-h-0 flex-col rounded-xl">
      <div className="border-b border-cyan-200/10 p-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms…"
          aria-label="Search NASA terms"
          className="w-full rounded-lg border border-cyan-200/15 bg-black/30 px-3 py-2.5 font-sans text-sm text-white placeholder:text-slate-500 outline-none focus:border-glow/50"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {termCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-2.5 py-1 font-display text-[11px] font-medium uppercase tracking-wide ${
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
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-2">
          {filtered.map((t) => (
            <li key={t.term}>
              <TermRow
                term={t.term}
                definition={t.definition}
                category={t.category}
                onAdd={() => onAddTerm(t.term)}
                justAdded={lastAdded === t.term}
              />
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">No matches</p>
        )}
      </div>
    </div>
  );
}
