import { listCampaigns } from "@/lib/api/campaigns";
import { Card } from "@/components/ui/card";
import { Campaign } from "@renegade-fanclub/types";
import { CampaignActions } from "./actions";

export default async function CampaignsAdminPage() {
  const response = await listCampaigns();
  const campaigns = response.success ? response.data : [];

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
                    <p>Start: {new Date(campaign.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(campaign.endDate).toLocaleDateString()}</p>
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
