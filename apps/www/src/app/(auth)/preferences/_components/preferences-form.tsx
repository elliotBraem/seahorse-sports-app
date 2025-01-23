"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addFavoriteTeam } from "@/lib/api/teams";

interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  status: "active" | "locked";
  points: number;
}

type CategoryKey = "sports" | "teams";

type PreferenceCategory = {
  [K in CategoryKey]?: PreferenceItem[];
};

interface PreferencesFormProps {
  preferences: Array<{ [K in CategoryKey]?: PreferenceItem[] }>;
}

function isCategoryKey(key: string): key is CategoryKey {
  return ["sports", "teams"].includes(key);
}

export default function PreferencesForm({ preferences }: PreferencesFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>(
    {},
  );

  const handleCheckboxChange = (category: string, id: string) => {
    setSelectedItems((prev) => {
      const currentCategory = prev[category] || [];
      return {
        ...prev,
        [category]: currentCategory.includes(id)
          ? currentCategory.filter((item) => item !== id)
          : [...currentCategory, id],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Add selected teams as favorites
      if (selectedItems.teams?.length) {
        await Promise.all(
          selectedItems.teams.map((teamId) =>
            addFavoriteTeam({ teamId: parseInt(teamId, 10) }),
          ),
        );
      }

      // Navigate to quests page
      router.push("/quests");
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update preferences");
      console.error("Error updating preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      title="Preferences"
      description="Choose your favorite sports and teams!"
    >
      <div className="space-y-6">
        {preferences.map((categoryObj, index) => {
          const key = Object.keys(categoryObj)[0];
          if (!isCategoryKey(key)) return null;
          const items = categoryObj[key];

          return (
            <div key={index} className="space-y-4">
              <h2 className="text-lg font-bold capitalize">{key}</h2>
              {items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedItems[key]?.includes(item.id) || false}
                    onCheckedChange={() => handleCheckboxChange(key, item.id)}
                    disabled={item.status === "locked" || loading}
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <Button onClick={handleSubmit} disabled={loading}>
          Submit Preferences
        </Button>
      </div>
    </Container>
  );
}
