import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Container = ({
  className,
  children,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl space-y-4 overflow-y-auto overflow-x-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};
