"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="rounded border border-slate-600 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-glow/50 hover:text-glow disabled:opacity-40"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
