import { Card } from "@/components/ui/card";
import Link from "next/link";

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
