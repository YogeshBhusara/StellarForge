"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Write" },
  { href: "/terms", label: "Terms" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan-200/10 bg-[#04060d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[3.75rem] max-w-[1440px] items-center gap-6 px-3 sm:px-5">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-wide text-white"
        >
          Stellar<span className="text-glow">Forge</span>
        </Link>
        <ul className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-1.5 font-display text-sm font-medium ${
                    active
                      ? "bg-cyan-400/10 text-glow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
