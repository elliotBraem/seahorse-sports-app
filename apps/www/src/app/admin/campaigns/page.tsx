export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { listCampaigns } from "@/lib/api/campaigns";

export const metadata: Metadata = {
  title: "Campaign Management | RNG Fan Club",
  description:
    "Create, edit, and manage campaigns for RNG Fan Club events and competitions",
  openGraph: {
    title: "Campaign Management | RNG Fan Club",
    description:
      "Create, edit, and manage campaigns for RNG Fan Club events and competitions",
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
    title: "Campaign Management | RNG Fan Club",
    description:
      "Create, edit, and manage campaigns for RNG Fan Club events and competitions",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

import { Card } from "@/components/ui/card";
import { Campaign } from "@renegade-fanclub/types";
import { CampaignActions } from "./actions";

export default async function CampaignsAdminPage() {
  const campaigns = await listCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Campaigns</h2>
        <CampaignActions />
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No campaigns found. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign: Campaign) => (
            <Card key={campaign.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {campaign.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <p>
                      Start: {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      End: {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                    <p className="capitalize">Status: {campaign.status}</p>
                  </div>
                </div>
                <CampaignActions campaign={campaign} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
