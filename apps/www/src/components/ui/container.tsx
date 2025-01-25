import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
  size?: "default" | "sm" | "lg" | "fluid";
}

export const Container = ({
  className,
  children,
  size = "default",
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 safe-area-inset",
        "sm:px-6",
        "lg:px-8",
        {
          "max-w-7xl": size === "lg",
          "max-w-4xl": size === "default",
          "max-w-2xl": size === "sm",
          "max-w-none": size === "fluid",
        },
        "space-y-4 overflow-y-auto scrollbar-custom",
        className,
      )}
    >
      {children}
    </div>
  );
};
