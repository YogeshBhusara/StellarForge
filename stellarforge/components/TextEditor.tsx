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
  compact?: boolean;
}

const TextEditor = forwardRef<HTMLTextAreaElement, TextEditorProps>(
  function TextEditor(
    {
      value,
      onChange,
      placeholder = "Start writing…",
      onSubmitShortcut,
      id = "scene-editor",
      label = "Scene",
      compact = false,
    },
    ref
  ) {
    const overLimit = value.length > MAX_SCENE_LENGTH;

    return (
      <div className={compact ? "flex h-full min-h-0 flex-col" : "space-y-2"}>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor={id} className={compact ? "sr-only" : "font-display text-sm text-slate-300"}>
            {label}
          </label>
          <span
            className={`ml-auto font-display text-xs ${overLimit ? "text-red-400" : "text-slate-500"}`}
          >
            {value.length.toLocaleString()}
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
          className={
            compact
              ? "glass min-h-0 w-full flex-1 resize-none rounded-xl p-5 font-sans text-[17px] leading-8 tracking-[0.01em] text-[#eef3fb] placeholder:text-slate-500 outline-none focus:border-glow/60"
              : "glass min-h-[280px] w-full resize-y rounded-xl p-5 font-sans text-[17px] leading-8 text-[#eef3fb] placeholder:text-slate-500 outline-none focus:border-glow/60"
          }
        />
      </div>
    );
  }
);

export default TextEditor;
