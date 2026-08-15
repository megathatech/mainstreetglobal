"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "./nav-links";

type NavProps = {
  activeColor?: string;
  /** "light" = teks gelap di bg terang (Ken Gooz), "dark" = teks putih di bg gelap (Mainstreet, Brittco) */
  variant?: "light" | "dark";
};

export default function Nav({ activeColor = "text-orange-600", variant = "light" }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu otomatis tiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Kunci scroll body pas menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const iconColor = variant === "dark" ? "text-white" : "text-neutral-900";
  const panelBg = variant === "dark" ? "bg-neutral-950" : "bg-white";
  const panelText = variant === "dark" ? "text-white" : "text-neutral-900";
  const panelBorder = variant === "dark" ? "border-neutral-800" : "border-neutral-200";

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:${activeColor} ${
                isActive ? activeColor : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Hamburger button, mobile only */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`relative z-50 flex h-9 w-9 items-center justify-center md:hidden ${iconColor}`}
      >
        <span className="sr-only">Toggle menu</span>
        <div className="flex h-4 w-6 flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile slide-down panel */}
      <div
        className={`fixed inset-x-0 top-0 z-40 origin-top transform border-b ${panelBorder} ${panelBg} ${panelText} transition-all duration-300 ease-out md:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
        style={{ paddingTop: "5rem" }}
      >
        <nav className="flex flex-col gap-1 px-6 pb-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-3 text-base font-medium transition-colors ${
                  isActive ? activeColor : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
