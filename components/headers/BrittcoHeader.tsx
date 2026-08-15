import Link from "next/link";
import Image from "next/image";
import MenuDropdown from "@/components/shared/MenuDropdown";

const menuLinks = [
  { label: "Ken Gooz", href: "/" },
  { label: "Mainstreet Global", href: "/mainstreet-global" },
  { label: "Brittco Consulting", href: "/brittco-consulting" },
  { label: "Blog Post", href: "/blog-post" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function BrittcoHeader() {
  return (
    <header className="border-b border-neutral-800 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo di kiri + tagline di tengah */}
          <div className="flex flex-1 items-center gap-6">
            <Link href="/brittco-consulting" className="flex-shrink-0">
              <Image
                src="/brittco-logo.png"
                alt="Brittco Consulting Group"
                width={190}
                height={58}
                className="h-auto w-auto"
                priority
              />
            </Link>
            <div className="hidden border-l border-[var(--brittco-red)] pl-6 md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brittco-red)]">
                Canada. Southeast Asia.
              </p>
            </div>
          </div>

          {/* Menu dropdown di kanan */}
          <MenuDropdown links={menuLinks} variant="dark" />
        </div>
      </div>
      <div className="border-t border-neutral-800"></div>
    </header>
  );
}
