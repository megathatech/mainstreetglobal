import type { Metadata } from "next";
import { TrendingUp, DollarSign, Handshake, Building2, RefreshCw, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Mainstreet Global - International Restaurant Consulting & Development",
  description:
    "Mainstreet Global Inc. is a corporate consulting and project management firm dedicated to the hospitality and restaurant industry. Our work centres on business transformation, strategic planning, and building long-term financial value.",
  alternates: {
    canonical: "https://mainstreetglobal.ca/mainstreet-global/",
  },
  openGraph: {
    title: "Mainstreet Global - International Restaurant Consulting & Development",
    description:
      "Corporate consulting and project management firm dedicated to the hospitality and restaurant industry. Business transformation, strategic planning, and building long-term financial value.",
    url: "https://mainstreetglobal.ca/mainstreet-global/",
    siteName: "Mainstreet Global",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mainstreet Global Inc",
  url: "https://mainstreetglobal.ca/mainstreet-global/",
  founder: { "@type": "Person", name: "Ken Gooz" },
};

const services = [
  {
    title: "Franchise Development",
    description:
      "Creating scalable franchise systems, including process documentation, agreements, and marketing strategies. Executive support to accelerate franchise unit growth trajectory.",
    icon: TrendingUp,
  },
  {
    title: "Financial Blueprinting",
    description:
      "Designing franchise business models with ROI analysis, 5-year growth plans, store P&L, market sensitivity awareness, and revenue stream analysis.",
    icon: DollarSign,
  },
  {
    title: "Client Relationship Management",
    description:
      "Supporting licensing agreement negotiation and contract clarity, onboarding, and ongoing relationship management to achieve growth goals and brand strategies, while contributing to lead development and strategic expansion.",
    icon: Handshake,
  },
  {
    title: "Corporate Management",
    description:
      "Supporting restaurant companies at the regional, national, and international level.",
    icon: Building2,
  },
  {
    title: "Business Transformation",
    description:
      "Guiding adaptive adjustments and transformational change initiatives.",
    icon: RefreshCw,
  },
  {
    title: "Market Expansion",
    description:
      "Assisting national and international brands with entry into Vancouver, Calgary, Edmonton, and select global markets.",
    icon: Globe2,
  },
];

export default function MainstreetGlobalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Intro Section */}
      <section className="bg-[var(--mainstreet-gray)] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-base leading-relaxed text-neutral-700">
            Mainstreet Global Inc. is a corporate consulting and project management firm dedicated
            to the hospitality and restaurant industry. Our work centres on business transformation,
            strategic planning, and building long-term financial value for restaurant brands and
            hospitality companies across Western Canada and Southeast Asia, with a reach into
            Europe.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[var(--mainstreet-gray)] px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">HERE IS SOME OF WHAT WE DO</h2>
            <div className="mt-2 h-1 w-32 bg-[var(--mainstreet-blue)]"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex flex-col rounded-2xl bg-gradient-to-br from-[var(--mainstreet-blue)] to-[var(--mainstreet-light-blue)] p-8 text-white shadow-lg transition-transform hover:scale-105"
              >
                <service.icon className="mb-4 h-10 w-10" strokeWidth={1.5} />
                <h3 className="mb-4 text-xl font-bold">{service.title}</h3>
                <p className="text-sm leading-relaxed text-blue-50">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
