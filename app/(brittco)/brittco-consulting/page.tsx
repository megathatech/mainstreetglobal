import type { Metadata } from "next";
import { Building2, Globe2, DollarSign, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Brittco Consulting Group - Restaurant Consulting & Development",
  description:
    "With over 20 years of experience in the restaurant industry, we understand the intricacies of operations, quality assurance, financial management, and overall business leadership.",
  alternates: {
    canonical: "https://mainstreetglobal.ca/brittco-consulting/",
  },
  openGraph: {
    title: "Brittco Consulting Group - Restaurant Consulting & Development",
    description:
      "With over 20 years of experience in the restaurant industry, we understand the intricacies of operations, quality assurance, financial management, and overall business leadership.",
    url: "https://mainstreetglobal.ca/brittco-consulting/",
    siteName: "Brittco Consulting Group",
    type: "website",
  },
};

const services = [
  {
    title: "HOSPITALITY MANAGEMENT",
    items: [
      "Multi-Unit operating programs",
      "Brand Standards",
      "Guest experience",
      "Culinary",
    ],
    color: "from-yellow-600 to-yellow-700",
  },
  {
    title: "MARKET ENTRY",
    items: ["Set up", "Entry"],
    color: "from-yellow-600 to-yellow-700",
  },
  {
    title: "FINANCIAL",
    items: [
      "Proforma development",
      "Turn-key vs F&O",
      "Store business models",
      "Pricing structures",
    ],
    color: "from-yellow-600 to-yellow-700",
  },
  {
    title: "FRANCHISE & LICENSING",
    items: [
      "Franchise, licensing company",
      "Franchising business model",
      "Franchise documents",
      "Licensing agreements",
      "Intellectual property",
    ],
    color: "from-yellow-600 to-yellow-700",
  },
];

export default function BrittcoConsultingPage() {
  return (
    <div className="bg-white">
      {/* About Us Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-4xl font-bold text-neutral-900">ABOUT US</h2>
          <div className="space-y-6 text-base leading-relaxed text-neutral-700">
            <p>
              With over 20 years of experience in the restaurant industry, we understand the
              intricacies of operations, quality assurance, financial management, and overall
              business leadership. Our expertise enables us to optimize operations and culinary
              strategies to enhance guest experiences, boost sales, control costs and maximize
              profitability.
            </p>
            <p>
              Having worked across Canada, Southeast Asia, and the Kingdom of Saudi Arabia, with a
              reach into Europe, the Brittco team brings a global perspective that enriches our
              approach to creating businesses and brands that resonate with you, your customers, and
              investors alike.
            </p>
            <p>
              Our professional journey includes collaborations with chain restaurants, franchise
              companies, independent enterprises and convention/trade/entertainment F&B.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="bg-neutral-200 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-4xl font-bold text-neutral-900">EXPERTISE</h2>
          <p className="text-center text-base leading-relaxed text-neutral-700">
            Bringing realized shareholder value to investments through key initiatives that drive
            long-term financial strategy and superior ROI enhancing the true market value for
            restaurant brands and franchise companies.
          </p>
        </div>
      </section>

      {/* Services Section with Background Image */}
      <section className="relative bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 px-6 py-20">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-yellow-400">SERVICES</h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="text-center">
                <h3 className="mb-6 text-sm font-bold text-yellow-400">{service.title}</h3>
                <ul className="space-y-3 text-sm text-white">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-300 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-neutral-900">OUR VALUES</h2>
          
          <div className="space-y-4 text-base text-neutral-800">
            <p>
              <strong className="font-bold text-neutral-900">Integrity–</strong> uphold the highest
              standards of <em>professionalism, confidentiality, and transparency</em>.{" "}
              <strong className="font-bold text-neutral-900">Respect–</strong> value each other,
              respect contributions.
            </p>
            <p>
              <strong className="font-bold text-neutral-900">Culture–</strong> practice cultural
              nuances, protocols, lifestyle.{" "}
              <strong className="font-bold text-neutral-900">Excellence–</strong> upholding client
              image, conduct to stakeholders and client business partners.{" "}
              <strong className="font-bold text-neutral-900">Outcomes–</strong> improved shareholder
              returns value of assets.{" "}
              <strong className="font-bold text-neutral-900">Profit–</strong> make decisions that
              build shareholder value and great financial returns to investment and client partners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
