"use client";

import { usePathname } from "next/navigation";
import KenGoozHeaderHome from "@/components/headers/KenGoozHeaderHome";
import KenGoozHeaderPages from "@/components/headers/KenGoozHeaderPages";
import KenGoozFooter from "@/components/footers/KenGoozFooter";

// Layout ini otomatis dipakai untuk "/", "/blog-post", dan "/contact-us"
// karena ketiganya ada di dalam folder (kengooz)
export default function KenGoozLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Homepage menggunakan header khusus dengan logo di tengah
  const isHomePage = pathname === "/";
  
  return (
    <>
      {isHomePage ? <KenGoozHeaderHome /> : <KenGoozHeaderPages />}
      <main>{children}</main>
      <KenGoozFooter />
    </>
  );
}
