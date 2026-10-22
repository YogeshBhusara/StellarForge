"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import ResponsePanel from "@/components/ResponsePanel";
import TermExplorerPanel from "@/components/TermExplorerPanel";
import { SAMPLE_SCENE } from "@/lib/constants";
import { extractRewrittenScene, insertAtCursor } from "@/lib/insertText";

const DRAFT_KEY = "stellarforge:write-draft";

type Action = "enhance" | "analyze";

function scoreMeta(score: number) {
  if (score <= 3) return { label: "Implausible", color: "bg-red-500", text: "text-red-300" };
  if (score <= 6) return { label: "Mixed", color: "bg-amber-400", text: "text-amber-300" };
  if (score <= 8) return { label: "Grounded", color: "bg-cyan-400", text: "text-glow" };
  return { label: "Solid", color: "bg-emerald-400", text: "text-emerald-300" };
}

export default function Workspace() {
  const searchParams = useSearchParams();
  const [scene, setScene] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [showTerms, setShowTerms] = useState(false);
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
      window.history.replaceState({}, "", "/");
    } else if (saved) {
      setScene(saved);
    }
    hydrated.current = true;
    if (window.matchMedia("(min-width: 1024px)").matches) setShowTerms(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(DRAFT_KEY, scene);
  }, [scene]);

  const insertTerm = useCallback(
    (term: string) => {
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
    },
    [scene]
  );

  async function run(action: Action) {
    setError(null);
    if (!scene.trim()) {
      setError("Type a scene first.");
      textareaRef.current?.focus();
      return;
    }
    setBusy(action);
    setLastAction(action);
    if (action === "enhance") setResult(null);
    else {
      setAnalysis(null);
      setScore(null);
    }
    try {
      const res = await fetch(action === "enhance" ? "/api/enhance" : "/api/realism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: scene.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (action === "enhance") {
        setResult(data.enhanced ?? "");
      } else {
        setAnalysis(data.analysis ?? "");
        setScore(typeof data.plausibilityScore === "number" ? data.plausibilityScore : 5);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  const rewritten = result ? extractRewrittenScene(result) : null;
  const meta = score !== null ? scoreMeta(score) : null;
  const canRun = Boolean(scene.trim()) && !busy;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 lg:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => run("enhance")} disabled={!canRun} className="btn-primary">
            {busy === "enhance" ? "Enhancing…" : "Enhance"}
          </button>
          <button type="button" onClick={() => run("analyze")} disabled={!canRun} className="btn-ghost">
            {busy === "analyze" ? "Analyzing…" : "Analyze"}
          </button>
          <button
            type="button"
            onClick={() => {
              setScene(SAMPLE_SCENE);
              textareaRef.current?.focus();
            }}
            className="btn-quiet"
          >
            Sample
          </button>
          {scene ? (
            <button
              type="button"
              onClick={() => {
                setScene("");
                setResult(null);
                setAnalysis(null);
                setScore(null);
                textareaRef.current?.focus();
              }}
              className="btn-quiet"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setShowTerms((s) => !s)}
            className="btn-quiet ml-auto"
          >
            {showTerms ? "Hide terms" : "Terms"}
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <TextEditor
            ref={textareaRef}
            value={scene}
            onChange={setScene}
            onSubmitShortcut={() => run("enhance")}
            placeholder="Start writing…"
            compact
          />
        </div>

        {error && (
          <p className="shrink-0 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}

        <div className="min-h-0 max-h-[38%] shrink-0 overflow-y-auto">
          {lastAction === "analyze" && score !== null && meta && busy !== "analyze" && (
            <div className="glass mb-3 flex items-center gap-3 rounded-xl px-4 py-3">
              <span className={`font-display text-3xl font-bold ${meta.text}`}>{score}</span>
              <span className="text-sm text-slate-300">/10 {meta.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full ${meta.color}`}
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
          <ResponsePanel
            content={lastAction === "analyze" ? analysis : result}
            isLoading={busy !== null}
            loadingLabel={busy === "analyze" ? "Analyzing…" : "Enhancing…"}
            compact
            actions={
              rewritten && lastAction === "enhance" && !busy ? (
                <button
                  type="button"
                  onClick={() => setScene(rewritten)}
                  className="btn-quiet px-2 py-1 text-sm"
                >
                  Use rewrite
                </button>
              ) : null
            }
          />
        </div>
      </section>

      {showTerms && (
        <aside className="flex h-[40vh] min-h-0 w-full shrink-0 flex-col lg:h-auto lg:w-80">
          <TermExplorerPanel onAddTerm={insertTerm} lastAdded={lastAdded} />
        </aside>
      )}
    </div>
  );
}
