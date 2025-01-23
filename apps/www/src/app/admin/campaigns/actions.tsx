"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/lib/api/campaigns";
import { useAuthStore } from "@/lib/store";
import { Campaign } from "@renegade-fanclub/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CampaignActionsProps {
  campaign?: Campaign;
}

export function CampaignActions({ campaign }: CampaignActionsProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accountId } = useAuthStore();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setError(null);
      const newCampaign = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        status: formData.get("status") as "upcoming" | "active" | "completed",
        rules: {},
      };

      await createCampaign(newCampaign, { accountId });
      setIsCreateOpen(false);
      router.refresh();
    } catch (err) {
      setError("Failed to create campaign");
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!campaign) return;

    try {
      setError(null);
      const updates = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        status: formData.get("status") as "upcoming" | "active" | "completed",
      };

      const response = await updateCampaign(campaign.id, updates);
      if (response.success) {
        setIsEditOpen(false);
        router.refresh();
      } else {
        setError("Failed to update campaign");
      }
    } catch (err) {
      setError("Failed to update campaign");
    }
  };

  const handleDelete = async () => {
    if (!campaign) return;

    try {
      setError(null);
      const response = await deleteCampaign(campaign.id, { accountId });
      if (response.success) {
        router.refresh();
      } else {
        setError("Failed to delete campaign");
      }
    } catch (err) {
      setError("Failed to delete campaign");
    }
  };

  // If no campaign is provided, show create button
  if (!campaign) {
    return (
      <>
        <Button onClick={() => setIsCreateOpen(true)}>Create Campaign</Button>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <h2 className="text-lg font-semibold">Create Campaign</h2>

              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </Dialog>
      </>
    );
  }

  // If campaign is provided, show edit/delete buttons
  return (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => setIsEditOpen(true)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <div className="p-6">
          <form onSubmit={handleEdit} className="space-y-4">
            <h2 className="text-lg font-semibold">Edit Campaign</h2>

            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={campaign.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                defaultValue={campaign.description || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={campaign.startDate.split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={campaign.endDate.split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full rounded-md border border-input px-3 py-2"
                defaultValue={campaign.status}
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
