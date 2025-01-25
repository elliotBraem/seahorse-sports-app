import { cn } from "@/lib/utils";

interface ContainerProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Container = ({
  title,
  description,
  className,
  children,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl py-5 px-4 md:px-6 space-y-4 overflow-y-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};
