import MainstreetHeader from "@/components/headers/MainstreetHeader";
import MainstreetFooter from "@/components/footers/MainstreetFooter";

export default function MainstreetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainstreetHeader />
      <main>{children}</main>
      <MainstreetFooter />
    </>
  );
}
