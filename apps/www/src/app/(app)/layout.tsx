import { BottomNav } from "@/components/bottom-nav";
import { Container } from "@/components/ui/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24 md:pb-24">
      <Container>{children}</Container>
      <BottomNav />
    </div>
  );
}
