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
import { logout } from "@/lib/auth";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { faArrowRight, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
  const { data: user } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: user?.email || undefined },
  });

  const onSubmit = async (data: FormData) => {
    if (!isDirty) return;

    try {
      setIsLoading(true);
      await updateUserProfile({
        email: data.email,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
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
  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Header showtitle={true} showBackButton={true} />
      <Container>
        <div className="px-2 pb-20 space-y-6">
          <div className="space-y-6">
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
                        <FormLabel className="text-sm font-medium text-white">
                          Email
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="abc@domain.com"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              {...field}
                              onChange={(e) =>
                                handleInputChange(e, field.onChange)
                              }
                            />
                          </FormControl>
                          {isDirty && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <button
                                className="text-white/60 hover:text-white transition-colors"
                                title="Save changes"
                                type="submit"
                              >
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-sm text-white/60 font-mono break-all">
                ID: {user.id}
              </p>
            </div>

            <Button
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500"
              variant="ghost"
              disabled={isLoading}
              onClick={async () => {
                try {
                  await logout();
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to logout. Please try again.",
                  });
                }
              }}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin h-4 w-4"
                />
              ) : (
                "Logout"
              )}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
