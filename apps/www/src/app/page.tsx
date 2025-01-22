import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container>
      <div className="flex min-h-dvh flex-col justify-center overflow-hidden items-center px-4 text-center">
        <Card className=" max-w-xl">
          <CardContent className="space-y-10 pt-6">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl text-white font-bold tracking-tight">
                Welcome to ------
              </h1>
              <p className="text-muted">
                Your ultimate platform for engaging with your favorite artists
              </p>
            </div>

            {/* CTA Section */}
            <div>
              <Link href="/login">
                <Button className="rounded-full" size="lg">
                  Get Started
                </Button>
              </Link>
              <p className="text-center text-sm text-muted mt-4">
                Join thousands of fans already on the platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
