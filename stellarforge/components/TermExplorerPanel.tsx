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
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 transition-all hover:border-glow/30">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowDef((s) => !s)}
          className="flex-1 text-left"
          aria-expanded={showDef}
        >
          <span className="block font-mono text-sm font-medium text-glow">{term}</span>
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-slate-500">
            {category}
          </span>
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded bg-cyan-600/80 px-2 py-1 font-mono text-xs text-white transition-colors hover:bg-cyan-500"
        >
          {justAdded ? "Added" : "Add"}
        </button>
      </div>
      {showDef && <p className="mt-2 text-xs leading-relaxed text-slate-400">{definition}</p>}
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
    <div className="flex h-full max-h-[70vh] flex-col rounded-lg border border-slate-700/50 bg-slate-900/30 lg:max-h-[calc(100vh-8rem)]">
      <div className="border-b border-slate-700/50 p-3">
        <h2 className="font-mono text-sm font-semibold text-white">Term Explorer</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Search, then Add to insert at the cursor
        </p>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          aria-label="Search NASA terms"
          className="mt-3 w-full rounded border border-slate-600 bg-slate-800/80 px-3 py-2 font-mono text-xs text-white placeholder-slate-500 outline-none focus:border-glow focus:ring-1 focus:ring-glow/20"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {termCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                category === c
                  ? "bg-cyan-600/30 text-glow"
                  : "bg-slate-800 text-slate-500 hover:text-slate-300"
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
          <p className="py-4 text-center font-mono text-xs text-slate-500">
            No terms match
          </p>
        )}
      </div>
    </div>
  );
}
