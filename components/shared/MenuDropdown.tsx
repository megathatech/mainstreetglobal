"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import MobileMenuSidebar from "./MobileMenuSidebar";

type MenuLink = {
  label: string;
  href: string;
};

type MenuDropdownProps = {
  links: MenuLink[];
  variant?: "light" | "dark";
};

export default function MenuDropdown({ links, variant = "light" }: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const textColor = variant === "dark" ? "text-white" : "text-neutral-900";
  const hoverColor = variant === "dark" ? "hover:text-neutral-300" : "hover:text-neutral-600";
  const bgColor = variant === "dark" ? "bg-neutral-900" : "bg-white";
  const borderColor = variant === "dark" ? "border-neutral-700" : "border-neutral-200";

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="relative hidden md:block" ref={dropdownRef}>
        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors ${textColor} ${hoverColor}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Menu
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border ${borderColor} ${bgColor} shadow-xl`}
          >
            <div className="py-2">
              {links.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-100 text-neutral-900"
                          : `${textColor} hover:bg-neutral-50 ${
                              variant === "dark" ? "hover:bg-neutral-800" : ""
                            }`
                      }`}
                    >
                      {link.label}
                    </Link>
                    {index < links.length - 1 && (
                      <div className={`mx-4 border-t ${borderColor}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <MobileMenuSidebar links={links} variant={variant} />
    </>
  );
}
