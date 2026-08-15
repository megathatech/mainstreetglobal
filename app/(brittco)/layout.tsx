import BrittcoHeader from "@/components/headers/BrittcoHeader";
import BrittcoFooter from "@/components/footers/BrittcoFooter";

export default function BrittcoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrittcoHeader />
      <main>{children}</main>
      <BrittcoFooter />
    </>
  );
}
