import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

// Custom social media icons
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

export const metadata: Metadata = {
  title: "Contact Us - Ken Gooz & Mainstreet Global",
  description:
    "Get in touch with Ken Gooz and Mainstreet Global Inc. We welcome the opportunity to connect with restaurant founders, corporate leadership teams, investors, and hospitality organizations.",
  alternates: {
    canonical: "https://mainstreetglobal.ca/contact-us/",
  },
  openGraph: {
    title: "Contact Us - Ken Gooz & Mainstreet Global",
    description:
      "Connect with restaurant consulting experts for growth, development, and strategic advisory services.",
    url: "https://mainstreetglobal.ca/contact-us/",
    siteName: "Ken Gooz",
    type: "website",
  },
};

export default function ContactUsPage() {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900">Contact Us</h1>
          <p className="mt-3 text-lg text-neutral-600">
            Growth · Development · Strategic Advisory
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Collaboration Info */}
          <div className="rounded-2xl bg-white p-8 shadow-lg lg:p-10">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--kengooz-navy)]">
                LET&apos;S START THE CONVERSATION
              </p>
              <h2 className="mt-2 text-3xl font-bold text-neutral-900">Collaborations</h2>
            </div>

            <div className="space-y-6 text-base leading-relaxed text-neutral-700">
              <p>
                We welcome the opportunity to connect with restaurant founders, corporate
                leadership teams, investors, and hospitality organizations exploring growth,
                development, or strategic initiatives.
              </p>
              <p>
                Our team looks forward to learning more about your project and exploring how
                Mainstreet Global may support your objectives.
              </p>
            </div>

            {/* Contact Details */}
            <div className="mt-10 rounded-xl bg-[var(--kengooz-navy)] p-6 text-white">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
                CONTACT
              </p>
              <h3 className="text-2xl font-bold">Ken Gooz</h3>
              <p className="mt-1 text-sm text-blue-100">President &amp; CEO</p>
              <p className="mt-1 text-sm text-blue-100">Mainstreet Global Inc</p>
              <a
                href="mailto:MainstreetGlobal@gmail.com"
                className="mt-4 inline-flex items-center gap-2 text-base font-medium text-blue-200 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
                MainstreetGlobal@gmail.com
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg lg:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
