"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import toast from "react-hot-toast";

const preferences = [
  {
    sports: [
      {
        id: "1",
        title: "Football",
        description: "NFL, MLB, NCAA, etc.",
        points: 100,
        status: "active",
      },
      {
        id: "2",
        title: "Basketball",
        description: "NBA, WNBA, NCAA, etc.",
        points: 200,
        status: "locked",
      },
    ],
  },
  {
    teams: [
      {
        id: "1",
        title: "New York Giants",
        description:
          "The New York Giants are a professional American football team based in East Rutherford, New Jersey.",
        points: 100,
        status: "active",
      },
      {
        id: "2",
        title: "Los Angeles Rams",
        description:
          "The Los Angeles Rams are a professional American football team based in Los Angeles, California.",
        points: 200,
        status: "locked",
      },
    ],
  },
  {
    leagues: [
      {
        id: "1",
        title: "NFL",
        description: "National Football League",
        points: 100,
        status: "active",
      },
      {
        id: "2",
        title: "NBA",
        description: "National Basketball Association",
        points: 200,
        status: "locked",
      },
    ],
  },
  {
    athletes: [
      {
        id: "1",
        title: "Michael Jordan",
        description:
          "Michael Jordan is an American basketball player who played for the Chicago Bulls, Los Angeles Lakers, and Chicago Bulls of the National Basketball Association (NBA).",
        points: 100,
        status: "active",
      },
      {
        id: "2",
        title: "LeBron James",
        description:
          "LeBron James is an American basketball player who plays for the Los Angeles Lakers of the National Basketball Association (NBA).",
        points: 200,
        status: "locked",
      },
    ],
  },
];

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: string[];
  }>({});

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
        params.append(key, value);
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
          const categoryKey = Object.keys(
            categoryObj
          )[0] as keyof typeof categoryObj;
          const items = categoryObj[categoryKey];

          return (
            <div key={index} className="space-y-4">
              <h2 className="text-lg font-bold capitalize">{categoryKey}</h2>
              {items?.map((item) => (
                <div key={item.title} className="flex items-center space-x-4">
                  <Checkbox
                    checked={
                      selectedItems[categoryKey]?.includes(item.title) || false
                    }
                    onCheckedChange={() =>
                      handleCheckboxChange(categoryKey, item.title)
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

        <Button onClick={handleSubmit}>Submit Preferences</Button>
      </div>
    </Container>
  );
}
