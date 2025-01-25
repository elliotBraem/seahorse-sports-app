import { Container } from "@/components/ui/container";
import Image from "next/image";
import { Login } from "./(auth)/_components/login";
import { Suspense } from "react";
import { Metadata } from "next";
import { BackgroundImage } from "./(auth)/_components/background-image";

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
    <>
    {/* Background layers */}
      <div className="fixed inset-0 z-5">
        {/* Base background image */}
        <BackgroundImage />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40" />
      </div>
      {/* Page content with contrast from the background (whether it is the black gradient, or the faded image) */}
      <Container className="relative z-10">
        <div className="flex h-screen overflow-hidden flex-col items-center px-4 py-12 z-20">
          <div className="w-64 h-64">
            <Image
              src={"https://www.rngfan.club/wp-content/uploads/white.png"}
              alt="Renegade Fan Club"
              width={256}
              height={256}
              className="w-full h-full object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="space-y-6">
            <Suspense fallback="Loading...">
              <Login />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
