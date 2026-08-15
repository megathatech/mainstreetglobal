"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { NAV_LINKS } from "./nav-links";

type NavProps = {
  activeColor?: string;
  /** "light" = teks gelap di bg terang (Ken Gooz), "dark" = teks putih di bg gelap (Mainstreet, Brittco) */
  variant?: "light" | "dark";
};

export default function Nav({ activeColor = "text-neutral-900", variant = "light" }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu otomatis tiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Kunci scroll body pas menu terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const textColor = variant === "dark" ? "text-white" : "text-neutral-900";
  const bgColor = variant === "dark" ? "bg-neutral-900" : "bg-white";
  const borderColor = variant === "dark" ? "border-neutral-700" : "border-neutral-200";
  const hoverBg = variant === "dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-50";
  const activeBg = variant === "dark" ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-900";

  return (
    <>
      {/* Hamburger button — all screen sizes */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${textColor} ${hoverBg}`}
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">Menu</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — slides in from right */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform shadow-2xl transition-transform duration-300 ease-out ${bgColor} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between border-b ${borderColor} px-6 py-5`}>
            <h2 className={`text-base font-semibold ${textColor}`}>Menu</h2>
            <button
              onClick={() => setOpen(false)}
              className={`rounded-md p-2 transition-colors ${hoverBg}`}
              aria-label="Close menu"
            >
              <X className={`h-5 w-5 ${textColor}`} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? activeBg : `${textColor} ${hoverBg}`
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className={`border-t ${borderColor} px-6 py-5`}>
            <p className={`text-xs ${variant === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
              © {new Date().getFullYear()} Ken Gooz & Partners
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
