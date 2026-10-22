"use client";

import { forwardRef } from "react";
import { MAX_SCENE_LENGTH } from "@/lib/constants";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmitShortcut?: () => void;
  id?: string;
  label?: string;
}

const TextEditor = forwardRef<HTMLTextAreaElement, TextEditorProps>(
  function TextEditor(
    {
      value,
      onChange,
      placeholder = "Paste or type your scene here...",
      onSubmitShortcut,
      id = "scene-editor",
      label = "Scene",
    },
    ref
  ) {
    const remaining = MAX_SCENE_LENGTH - value.length;
    const overLimit = remaining < 0;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={id} className="font-mono text-xs uppercase tracking-wide text-slate-500">
            {label}
          </label>
          <span
            className={`font-mono text-xs ${overLimit ? "text-red-400" : "text-slate-500"}`}
          >
            {value.length.toLocaleString()} / {MAX_SCENE_LENGTH.toLocaleString()}
          </span>
        </div>
        <textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              onSubmitShortcut?.();
            }
          }}
          placeholder={placeholder}
          maxLength={MAX_SCENE_LENGTH}
          aria-describedby={`${id}-hint`}
          className="min-h-[280px] w-full resize-y rounded-lg border border-slate-600 bg-slate-900/80 p-4 font-mono text-sm leading-relaxed text-white placeholder-slate-500 outline-none transition-all focus:border-glow focus:ring-2 focus:ring-glow/20"
        />
        <p id={`${id}-hint`} className="font-mono text-xs text-slate-500">
          ⌘ / Ctrl + Enter to run
        </p>
      </div>
    );
  }
);

export default TextEditor;
