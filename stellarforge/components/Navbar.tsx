"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/write", label: "Write Studio" },
  { href: "/terms", label: "Term Explorer" },
  { href: "/realism", label: "Realism Checker" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-void/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-lg font-medium text-white transition-colors hover:text-glow"
          onClick={() => setOpen(false)}
        >
          StellarForge
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded px-3 py-2 font-mono text-sm transition-all ${
                    active
                      ? "bg-slate-800/80 text-glow shadow-glow-sm"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-glow"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="rounded border border-slate-600 px-3 py-1.5 font-mono text-xs text-slate-300 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <ul className="border-t border-slate-800 bg-void/95 px-4 py-3 md:hidden">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded px-3 py-2.5 font-mono text-sm ${
                    active ? "text-glow" : "text-slate-300"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
