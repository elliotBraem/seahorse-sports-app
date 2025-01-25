import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[40px] whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-poppins capitalize touch-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-secondary from-30% to-[#FFA37BB0] to-100% text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:from-[#FFA37BB0] hover:to-secondary transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:bg-destructive/90",
        outline:
          "border-2 border-muted bg-transparent shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] hover:bg-gradient-to-r hover:border-0 hover:from-secondary hover:to-[#FFA37BB0] hover:text-white",
        secondary:
          "bg-[#3006A4] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 transition-all duration-200",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground active:scale-[0.98] transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5 min-w-[100px]",
        sm: "h-9 rounded-[40px] px-4 py-2 text-xs min-w-[80px]",
        lg: "h-12 rounded-[40px] px-10 py-3 min-w-[120px]",
        xl: "h-14 rounded-[40px] px-12 py-3.5 text-base min-w-[140px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
