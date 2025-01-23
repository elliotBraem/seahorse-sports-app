import { Container } from "@/components/ui/container";
import Image from "next/image";
import { Login } from "./_components/login";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | RNG Fan Club",
  description: "Get in the game with your friends",
  openGraph: {
    title: "Home | RNG Fan Club",
    description:
      "Welcome to RNG Fan Club, your destination for amazing games and events",
    images: [
      {
        url: "/images/rngfanclub-logo-white.png",
        width: 1200,
        height: 630,
        alt: "RNG Fan Club Logo",
      },
    ],
  },
  twitter: {
    title: "Home | RNG Fan Club",
    description:
      "Welcome to RNG Fan Club, your destination for amazing games and events",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default function HomePage() {
  return (
    <Container>
      <div className="flex min-h-dvh flex-col justify-center items-center px-4 text-center space-y-16">
        <div className="w-64 h-64 relative">
          <Image
            src={"/images/rngfanclub-logo-white.png"}
            alt="Renegade Fan Club"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-6">
          <Suspense fallback="Loading...">
            <Login />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground">
            Connect with Apple or Google to start
          </p>
        </div>
      </div>
    </Container>
  );
}
