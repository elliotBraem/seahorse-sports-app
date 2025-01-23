import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

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

export default function AdminPage() {
  const sections = [
    {
      title: "Campaigns",
      description: "Create and manage campaigns",
      href: "/admin/campaigns",
    },
    {
      title: "Teams",
      description: "Manage team configurations",
      href: "/admin/teams",
    },
    {
      title: "Quests",
      description: "Create and modify quests",
      href: "/admin/quests",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <Link key={section.title} href={section.href}>
          <Card className="p-6 hover:bg-accent transition-colors">
            <h2 className="font-semibold text-lg">{section.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {section.description}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
