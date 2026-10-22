"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import ResponsePanel from "@/components/ResponsePanel";
import TermExplorerPanel from "@/components/TermExplorerPanel";
import PageHeader from "@/components/PageHeader";
import { SAMPLE_SCENE } from "@/lib/constants";
import { extractRewrittenScene, insertAtCursor } from "@/lib/insertText";

const DRAFT_KEY = "stellarforge:write-draft";

function WriteStudioInner() {
  const searchParams = useSearchParams();
  const [scene, setScene] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [usedTerms, setUsedTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(true);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY) ?? "";
    const term = searchParams.get("term");
    if (term) {
      const { value } = insertAtCursor(saved, term, saved.length, saved.length);
      setScene(value);
      setLastAdded(term);
      window.setTimeout(() => setLastAdded(null), 1400);
      window.history.replaceState({}, "", "/write");
    } else if (saved) {
      setScene(saved);
    }
    hydrated.current = true;
    // searchParams is read once on mount to seed a term from Term Explorer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(DRAFT_KEY, scene);
  }, [scene]);

  const insertTerm = useCallback((term: string) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? scene.length;
    const end = el?.selectionEnd ?? scene.length;
    const { value, cursor } = insertAtCursor(scene, term, start, end);
    setScene(value);
    setLastAdded(term);
    window.setTimeout(() => setLastAdded(null), 1400);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(cursor, cursor);
    });
  }, [scene]);

  async function handleEnhance() {
    setError(null);
    if (!scene.trim()) {
      setError("Enter a scene to enhance.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: scene.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enhancement failed");
      setResult(data.enhanced ?? "");
      setUsedTerms(Array.isArray(data.usedTerms) ? data.usedTerms : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const rewritten = result ? extractRewrittenScene(result) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Write Studio"
        description="Draft a scene, drop in NASA terms, then enhance it with scientifically grounded notes and a rewritten version."
        actions={
          <>
            <button
              type="button"
              onClick={() => setScene(SAMPLE_SCENE)}
              className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 font-mono text-sm text-slate-300 transition-colors hover:border-glow/50 hover:text-glow"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setShowTerms((s) => !s)}
              className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 font-mono text-sm text-slate-300 transition-colors hover:border-glow/50 hover:text-glow"
            >
              {showTerms ? "Hide" : "Show"} terms
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <TextEditor
            ref={textareaRef}
            value={scene}
            onChange={setScene}
            onSubmitShortcut={handleEnhance}
            placeholder="Start a scene. Add terms from the explorer, then enhance."
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleEnhance}
              disabled={loading || !scene.trim()}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-mono font-medium text-white shadow-glow transition-all hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Enhancing…" : "Enhance with Scientific Realism"}
            </button>
            {scene && (
              <button
                type="button"
                onClick={() => {
                  setScene("");
                  setResult(null);
                  setUsedTerms([]);
                }}
                className="font-mono text-xs text-slate-500 hover:text-slate-300"
              >
                Clear draft
              </button>
            )}
          </div>
          {error && (
            <p className="rounded border border-red-500/30 bg-red-950/40 px-3 py-2 font-mono text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          {usedTerms.length > 0 && !loading && (
            <p className="font-mono text-xs text-slate-500">
              Retrieved terms: {usedTerms.join(" · ")}
            </p>
          )}
          <ResponsePanel
            content={result}
            isLoading={loading}
            actions={
              rewritten ? (
                <button
                  type="button"
                  onClick={() => setScene(rewritten)}
                  className="rounded border border-slate-600 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-300 hover:border-glow/50 hover:text-glow"
                >
                  Use rewritten scene
                </button>
              ) : null
            }
          />
        </div>

        {showTerms && (
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-20">
              <TermExplorerPanel onAddTerm={insertTerm} lastAdded={lastAdded} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<p className="font-mono text-slate-500">Loading studio…</p>}>
      <WriteStudioInner />
    </Suspense>
  );
}
