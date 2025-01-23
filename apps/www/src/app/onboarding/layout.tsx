import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | RNG Fan Club",
  description: "Complete your profile setup to get started with RNG Fan Club",
  openGraph: {
    title: "Join RNG Fan Club",
    description:
      "Set up your profile and select your favorite sports and teams",
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
    title: "Join RNG Fan Club",
    description:
      "Set up your profile and select your favorite sports and teams",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
