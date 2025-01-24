import { BottomNav } from "@/components/bottom-nav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24 md:pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
