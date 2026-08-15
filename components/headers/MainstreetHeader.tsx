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

export default function MainstreetHeader() {
  return (
    <header className="border-b border-blue-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo di kiri + tagline di tengah */}
          <div className="flex flex-1 items-center gap-6">
            <Link href="/mainstreet-global" className="flex-shrink-0">
              <Image
                src="/mainstreet-logo.png"
                alt="Mainstreet Global"
                width={180}
                height={56}
                className="h-auto w-auto"
                priority
              />
            </Link>
            <div className="hidden border-l border-blue-300 pl-6 md:block">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--mainstreet-blue)]">
                International Restaurant Consulting & Development
              </p>
            </div>
          </div>

          {/* Menu dropdown di kanan */}
          <MenuDropdown links={menuLinks} variant="light" />
        </div>
      </div>
      <div className="border-t border-blue-100"></div>
    </header>
  );
}
