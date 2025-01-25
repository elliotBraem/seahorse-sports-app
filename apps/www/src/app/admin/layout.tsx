import { Container } from "@/components/ui/container";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="flex flex-col space-y-4">{children}</div>
    </Container>
  );
}
