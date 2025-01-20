import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useState } from "react";
import { ArrowRight, Loader2, Trash } from "lucide-react";
import { AlertModal } from "@/components/Modals/alert-modal";
import { Container } from "@/components/ui/container";

export const Route = createFileRoute("/_layout/_authenticated/settings")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z
    .string()
    .min(7, {
      message: "Email must be at least 7 characters.",
    })
    .max(50, {
      message: "Username must be at least 5 characters.",
    }),
});

// Define form data type using Zod's inferred type
type FormData = z.infer<typeof formSchema>;

function RouteComponent() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: userData?.email },
  });

  const handleLogout = () => {
    setLoading(true);
    logout();
    navigate({ to: "/" });
    setLoading(false);
  };

  const onDelete = () => {
    setLoading(true);
    setOpen(false);
    // Delete user data from local storage
    // Update user data in state
    toast.success("Data deleted successfully!");
    setLoading(false);
  };

  const onSubmit = (data: FormData) => {
    if (!isDirty) {
      return;
    }
    setLoading(true);
    console.log(data);
    // Save user data to local storage
    // Update user data in state
    toast.success("Data updated successfully!");
    setLoading(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    setIsDirty(event.target.value !== userData?.email); // Check if the input value is different from the user's email
    onChange(event);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <Container title="Settings" description="Manage your account settings!">
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
                        disabled={loading}
                        placeholder="shadcn"
                        {...field}
                        onChange={(e) => handleInputChange(e, field.onChange)} // Custom handler
                      />
                    </FormControl>
                    {isDirty && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <button
                          className="text-gray-500 hover:text-black"
                          title="Save changes"
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
        <div className="flex items-center justify-end space-x-4">
          <Button
            className="rounded-sm"
            variant="destructive"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button disabled={loading} onClick={handleLogout}>
            {loading ? <Loader2 className="animate-spin" /> : "Logout"}
          </Button>
        </div>
      </Container>
    </>
  );
}
