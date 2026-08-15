"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type MenuLink = {
  label: string;
  href: string;
};

type MobileMenuSidebarProps = {
  links: MenuLink[];
  variant?: "light" | "dark";
};

export default function MobileMenuSidebar({ links, variant = "light" }: MobileMenuSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const textColor = variant === "dark" ? "text-white" : "text-neutral-900";
  const bgColor = variant === "dark" ? "bg-neutral-900" : "bg-white";
  const borderColor = variant === "dark" ? "border-neutral-700" : "border-neutral-200";

  return (
    <>
      {/* Burger Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex flex-col gap-1.5 p-2 md:hidden ${textColor}`}
        aria-label="Open menu"
      >
        <span className="h-0.5 w-6 bg-current"></span>
        <span className="h-0.5 w-6 bg-current"></span>
        <span className="h-0.5 w-6 bg-current"></span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform transition-transform duration-300 ease-out md:hidden ${bgColor} ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between border-b ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor}`}>Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-md p-2 transition-colors hover:bg-neutral-100 ${
                variant === "dark" ? "hover:bg-neutral-800" : ""
              }`}
              aria-label="Close menu"
            >
              <X className={`h-6 w-6 ${textColor}`} />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900"
                        : `${textColor} hover:bg-neutral-50 ${
                            variant === "dark" ? "hover:bg-neutral-800" : ""
                          }`
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className={`border-t ${borderColor} p-6`}>
            <p className={`text-xs ${variant === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
              © {new Date().getFullYear()} Ken Gooz & Partners
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
