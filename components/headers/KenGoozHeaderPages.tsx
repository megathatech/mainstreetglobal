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

export default function KenGoozHeaderPages() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo di kiri + tagline di tengah */}
          <div className="flex flex-1 items-center gap-6">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/kengooz-logo.png"
                alt="Ken Gooz"
                width={160}
                height={52}
                className="h-auto w-auto"
                priority
              />
            </Link>
            <div className="hidden border-l border-neutral-300 pl-6 md:block">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                International Restaurant Consulting & Development
              </p>
            </div>
          </div>

          {/* Menu dropdown di kanan */}
          <MenuDropdown links={menuLinks} variant="light" />
        </div>
      </div>
      <div className="border-t border-neutral-300"></div>
    </header>
  );
}
