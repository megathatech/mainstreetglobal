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

export default function KenGoozHeaderHome() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo di tengah untuk homepage - LEBIH BESAR */}
          <div className="flex flex-1 justify-center">
            <Link href="/">
              <Image
                src="/kengooz-logo.png"
                alt="Ken Gooz"
                width={240}
                height={78}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Menu dropdown di kanan */}
          <MenuDropdown links={menuLinks} variant="light" />
        </div>
      </div>
      <div className="border-t border-neutral-300"></div>
    </header>
  );
}
