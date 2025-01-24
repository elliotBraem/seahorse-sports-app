"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store";
import {
  faArrowRight,
  faCircleNotch,
  faPenToSquare,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .min(7, {
      message: "Email must be at least 7 characters.",
    })
    .max(50, {
      message: "Username must be at least 5 characters.",
    }),
});

type FormData = z.infer<typeof FormSchema>;

export default function SettingsPage() {
  const { user, accountId, disconnectWallet } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: user?.email },
  });

  const onSubmit = async (data: FormData) => {
    if (!isDirty) return;

    try {
      setIsLoading(true);
      await updateUserProfile({
        email: data.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    setIsDirty(event.target.value !== user?.email);
    onChange(event);
  };

  // Show not found if no user is authenticated
  if (!user && !accountId) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Header showtitle={true} showBackButton={true} />
      <Container title="Settings" description="Manage your account settings!">
        {user && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="abc@.domain.com"
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                        />
                      </FormControl>
                      {isDirty && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <button
                            className="text-gray-500 hover:text-black"
                            title="Save changes"
                            type="submit"
                          >
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        <div className="flex items-center justify-between">
          <a
            href="/preferences"
            className="flex items-center justify-between space-x-2 text-lg font-medium"
          >
            <span>Prefrences</span>
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
          </a>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">NEAR Wallet</h2>
              <p className="text-sm text-muted-foreground">
                {accountId
                  ? "Connected as " + accountId
                  : "Connect your NEAR wallet"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button disabled={isLoading} onClick={disconnectWallet}>
            {isLoading ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </Container>
    </>
  );
}
