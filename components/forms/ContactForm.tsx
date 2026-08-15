"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setStatus("success");
        e.currentTarget.reset();
        // Reset status after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-[var(--kengooz-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kengooz-navy)]/20"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-[var(--kengooz-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kengooz-navy)]/20"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell us about your project or inquiry..."
            rows={6}
            required
            className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 transition-colors focus:border-[var(--kengooz-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--kengooz-navy)]/20"
          />
        </div>

        {/* Honeypot anti-spam, jangan dihapus */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send
              <Send className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-800">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Message sent successfully!</p>
              <p className="mt-1">We&apos;ll get back to you as soon as possible.</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Failed to send message.</p>
              <p className="mt-1">
                Please try again or email directly to{" "}
                <a
                  href="mailto:MainstreetGlobal@gmail.com"
                  className="font-medium underline hover:no-underline"
                >
                  MainstreetGlobal@gmail.com
                </a>
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
