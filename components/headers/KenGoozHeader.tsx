import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/shared/Nav";

export default function KenGoozHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center gap-2">
            <Image
              src="/kengooz-logo.png"
              alt="Ken Gooz"
              width={180}
              height={60}
              className="h-auto w-auto"
              priority
            />
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Emerging Restaurants. New Markets. Advisor
            </p>
          </Link>
          <Nav activeColor="text-neutral-900" variant="light" />
        </div>
      </div>
      <div className="border-t border-neutral-300"></div>
    </header>
  );
}
