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
import { useAuthStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const { user, accountId, connectWallet, disconnectWallet } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: user?.email },
  });

  const onSubmit = async (data: FormData) => {
    if (!isDirty) return;

    try {
      setIsLoading(true);
      // Save user data to local storage
      // Update user data in state
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    setIsDirty(event.target.value !== user?.email);
    onChange(event);
  };

  // Show loading state while auth is initializing
  if (!isVisible) return null;

  // Show not found if no user is authenticated
  if (!user && !accountId) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Container
        title="Settings"
        description="Manage your account settings!"
        isVisible={isVisible}
      >
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
                            <ArrowRight className="w-5 h-5" />
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
            {isLoading ? <Loader2 className="animate-spin" /> : "Logout"}
          </Button>
        </div>
      </Container>
    </>
  );
}
