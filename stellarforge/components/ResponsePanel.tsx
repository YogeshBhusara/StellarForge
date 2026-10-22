"use client";

import type { ReactNode } from "react";
import CopyButton from "@/components/CopyButton";

interface ResponsePanelProps {
  content: string | null;
  isLoading: boolean;
  loadingLabel?: string;
  actions?: ReactNode;
  compact?: boolean;
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function formatContent(text: string) {
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;

  function flushList(key: number) {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? "ol" : "ul";
    nodes.push(
      <Tag
        key={`list-${key}`}
        className={`ml-5 space-y-1 text-[15px] leading-7 text-slate-200 ${listBuffer.ordered ? "list-decimal" : "list-disc"}`}
      >
        {listBuffer.items.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
        ))}
      </Tag>
    );
    listBuffer = null;
  }

  lines.forEach((line, i) => {
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (bullet) {
      if (!listBuffer || listBuffer.ordered) {
        flushList(i);
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(bullet[1]);
      return;
    }
    if (numbered) {
      if (!listBuffer || !listBuffer.ordered) {
        flushList(i);
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(numbered[1]);
      return;
    }
    flushList(i);
    if (/^#+\s/.test(line)) {
      nodes.push(
        <h3 key={i} className="mt-5 font-display text-base font-semibold text-glow first:mt-0">
          {line.replace(/^#+\s*/, "")}
        </h3>
      );
      return;
    }
    if (line.trim() === "") {
      return;
    }
    nodes.push(
      <p key={i} className="mt-2 text-[15px] leading-7 text-slate-200">
        {renderInline(line, `p-${i}`)}
      </p>
    );
  });
  flushList(lines.length);
  return nodes;
}

export default function ResponsePanel({
  content,
  isLoading,
  loadingLabel = "Working…",
  actions,
  compact = false,
}: ResponsePanelProps) {
  if (isLoading) {
    return (
      <div className={`glass rounded-xl ${compact ? "p-4" : "p-6"}`}>
        <p className="animate-pulse font-display text-sm text-glow">{loadingLabel}</p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className={`glass rounded-xl ${compact ? "p-4" : "p-6"}`}>
      <div className="mb-3 flex items-center justify-end gap-2">
        {actions}
        <CopyButton text={content} />
      </div>
      <div className="max-w-none font-sans text-[15px] leading-7">{formatContent(content)}</div>
    </div>
  );
}
