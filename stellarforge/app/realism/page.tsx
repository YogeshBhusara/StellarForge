"use client";

import { useEffect, useRef, useState } from "react";
import TextEditor from "@/components/TextEditor";
import ResponsePanel from "@/components/ResponsePanel";
import PageHeader from "@/components/PageHeader";
import { SAMPLE_SCENE } from "@/lib/constants";

const DRAFT_KEY = "stellarforge:realism-draft";

function scoreMeta(score: number) {
  if (score <= 3) return { label: "Implausible", color: "bg-red-500", text: "text-red-400" };
  if (score <= 6) return { label: "Mixed", color: "bg-amber-500", text: "text-amber-400" };
  if (score <= 8) return { label: "Mostly grounded", color: "bg-cyan-500", text: "text-glow" };
  return { label: "Highly plausible", color: "bg-emerald-500", text: "text-emerald-400" };
}

export default function RealismPage() {
  const [scene, setScene] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [usedTerms, setUsedTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (saved) setScene(saved);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(DRAFT_KEY, scene);
  }, [scene]);

  async function handleAnalyze() {
    setError(null);
    if (!scene.trim()) {
      setError("Enter text to analyze.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setScore(null);
    try {
      const res = await fetch("/api/realism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: scene.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis ?? "");
      setScore(
        typeof data.plausibilityScore === "number" ? data.plausibilityScore : 5
      );
      setUsedTerms(Array.isArray(data.usedTerms) ? data.usedTerms : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const meta = score !== null ? scoreMeta(score) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Realism Checker"
        description="Score a scene for scientific plausibility and get mission-science notes you can act on."
        actions={
          <button
            type="button"
            onClick={() => setScene(SAMPLE_SCENE)}
            className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 font-mono text-sm text-slate-300 transition-colors hover:border-glow/50 hover:text-glow"
          >
            Load sample
          </button>
        }
      />
      <TextEditor
        id="realism-editor"
        value={scene}
        onChange={setScene}
        onSubmitShortcut={handleAnalyze}
        placeholder="Paste or type your scene for plausibility analysis..."
      />
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading || !scene.trim()}
        className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-mono font-medium text-white shadow-glow transition-all hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Analyze Scientific Plausibility"}
      </button>
      {error && (
        <p className="rounded border border-red-500/30 bg-red-950/40 px-3 py-2 font-mono text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
      {score !== null && meta && (
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-slate-500">
            Plausibility score
          </p>
          <div className="mt-3 flex items-end gap-4">
            <span className={`font-mono text-5xl font-bold ${meta.text}`}>{score}</span>
            <span className="pb-1 text-slate-500">/ 10</span>
            <span className={`pb-1 font-mono text-sm ${meta.text}`}>{meta.label}</span>
          </div>
          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800"
            role="meter"
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={score}
            aria-label="Plausibility score"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${meta.color}`}
              style={{ width: `${(score / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
      {usedTerms.length > 0 && !loading && (
        <p className="font-mono text-xs text-slate-500">
          Retrieved terms: {usedTerms.join(" · ")}
        </p>
      )}
      <ResponsePanel
        content={analysis}
        isLoading={loading}
        loadingLabel="Running plausibility analysis..."
      />
    </div>
  );
}
