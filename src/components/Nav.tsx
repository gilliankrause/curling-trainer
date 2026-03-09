"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Nav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    const id = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="relative z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-white">
          Curling Trainer
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-expanded={open}
            aria-haspopup="true"
            aria-label="Open menu"
          >
            <span>Menu</span>
            <svg
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div
              className="absolute right-0 top-full mt-1 w-56 rounded-md border border-slate-700 bg-slate-800 py-1 shadow-lg z-[100]"
              role="menu"
            >
              {status === "loading" ? (
                <div className="px-4 py-3 text-slate-400 text-sm">Loading...</div>
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/glossary"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Glossary
                  </Link>
                  <Link
                    href="/quiz"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Quiz
                  </Link>
                  <Link
                    href="/drills"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Drills
                  </Link>
                  <Link
                    href="/videos"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Video Analysis
                  </Link>
                  <Link
                    href="/sessions"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Sessions
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t border-slate-700 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/glossary"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Glossary
                  </Link>
                  <Link
                    href="/quiz"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Quiz
                  </Link>
                  <Link
                    href="/drills"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Drills
                  </Link>
                  <div className="border-t border-slate-700 my-1" />
                  <a
                    href="/login"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </a>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 rounded mx-2 mb-1"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
