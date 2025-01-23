import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | RNG Fan Club",
  description: "Manage campaigns, teams, and quests for RNG Fan Club",
  openGraph: {
    title: "Admin Dashboard | RNG Fan Club",
    description: "Manage campaigns, teams, and quests for RNG Fan Club",
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
    title: "Admin Dashboard | RNG Fan Club",
    description: "Manage campaigns, teams, and quests for RNG Fan Club",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container title="Admin Dashboard">
      <div className="flex flex-col space-y-4">{children}</div>
    </Container>
  );
}
