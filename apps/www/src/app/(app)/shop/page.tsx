import { Container } from "@/components/ui/container";

export default function ShopPage() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
        <p className="text-muted-foreground">
          The shop is currently under construction. Check back later!
        </p>
      </div>
    </Container>
  );
}
