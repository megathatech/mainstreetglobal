import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Ken Gooz - Hospitality Advisory and Development",
  description:
    "Supporting early-stage brands, restaurant companies, hospitality organizations, and investor-backed platforms with C-suite management, contract or mid-term international support.",
  alternates: {
    canonical: "https://mainstreetglobal.ca/",
  },
  openGraph: {
    title: "Ken Gooz - Hospitality Advisory and Development",
    description:
      "Supporting early-stage brands, restaurant companies, hospitality organizations, and investor-backed platforms with C-suite management, contract or mid-term international support.",
    url: "https://mainstreetglobal.ca/",
    siteName: "Ken Gooz",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ken Gooz",
  jobTitle: "President/CEO, Mainstreet Global Inc",
  url: "https://mainstreetglobal.ca/",
  worksFor: {
    "@type": "Organization",
    name: "Mainstreet Global Inc",
  },
};

export default function KenGoozHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="border-b border-neutral-300 bg-gradient-to-b from-white to-neutral-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Hospitality Advisory and Development
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Supporting early-stage brands, restaurant companies, hospitality organizations, and
            investor-backed platforms with C-suite management, contract or mid-term international
            support.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">
            Working with founders, executive teams, and ownership groups across growth planning,
            financial modelling, and organizational change.
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="bg-[var(--kengooz-navy)] px-6 py-8 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-white">
          Strategy. Structure. Execution.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--kengooz-beige)] px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Wherever you are now, we&apos;ll take you to what&apos;s next
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-700">
            Guiding your hospitality business through its next stage with clarity and strategy.
          </p>
          <Link
            href="/mainstreet-global"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--kengooz-navy)] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-opacity-90 hover:shadow-lg"
          >
            Move Forward Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
