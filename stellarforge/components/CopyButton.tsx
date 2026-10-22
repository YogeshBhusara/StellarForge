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
      className="rounded-md border border-cyan-200/20 bg-white/5 px-2.5 py-1 font-display text-xs font-medium text-slate-200 hover:border-glow/50 hover:text-glow disabled:opacity-40"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
