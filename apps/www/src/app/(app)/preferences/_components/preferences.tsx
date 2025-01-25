"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  status?: "active" | "locked";
  points: number;
}

type CategoryKey = "sports" | "teams" | "leagues" | "athletes";

type PreferenceCategory = {
  [K in CategoryKey]?: PreferenceItem[];
};

interface PrrferencesProps {
  preferences: Array<{ [K in CategoryKey]?: PreferenceItem[] }>;
}

// Type guard to check if a key is a valid CategoryKey
function isCategoryKey(key: string): key is CategoryKey {
  return ["sports", "teams", "leagues", "athletes"].includes(key);
}

export default function Preferences({ preferences }: PrrferencesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>(
    {},
  );

  const handleCheckboxChange = (category: string, title: string) => {
    setSelectedItems((prev) => {
      const currentCategory = prev[category] || [];
      return {
        ...prev,
        [category]: currentCategory.includes(title)
          ? currentCategory.filter((item) => item !== title)
          : [...currentCategory, title],
      };
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    // Construct preferences object
    const userPreferences = {
      sports: selectedItems.sports || [],
      teams: selectedItems.teams || [],
      leagues: selectedItems.leagues || [],
      athletes: selectedItems.athletes || [],
    };

    console.log("Selected preferences:", userPreferences);

    // Save preferences to local storage or backend
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

    // Create query parameters for navigation
    const params = new URLSearchParams();

    Object.entries(userPreferences).forEach(([key, values]) => {
      values.forEach((value) => {
        params.append(key, String(value)); // Ensuring the value is a string
      });
    });

    // Navigate with params
    router.push(`/quests?${params.toString()}`);

    // Notify success
    toast.success("Preferences updated successfully!");
    setLoading(false);
  };

  return (
    <Container
      title="Preferences"
      description="Choose Favorite Sports, Teams, Leagues, Athletes!"
    >
      <div className="space-y-6">
        {preferences.map((categoryObj, index) => {
          const key = Object.keys(categoryObj)[0];
          if (!isCategoryKey(key)) return null;
          const items = categoryObj[key];

          return (
            <div key={index} className="space-y-4">
              <h2 className="text-lg font-bold capitalize">{key}</h2>
              {items?.map((item: PreferenceItem) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedItems[key]?.includes(item.title) || false}
                    onCheckedChange={() =>
                      handleCheckboxChange(key, item.title)
                    }
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
