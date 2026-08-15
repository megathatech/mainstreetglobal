import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mainstreetglobal.ca"),
  title: "Mainstreet Global",
  description:
    "Ken Gooz, Mainstreet Global Inc, and Brittco Consulting — hospitality advisory and development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
