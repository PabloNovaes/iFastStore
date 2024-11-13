import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold dark:border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-[#ffe7f2] text-red-500 dark:bg-red-500/20 dark:border-red-900/50",
        warning:
          "border-transparent bg-amber-100 text-amber-400 dark:bg-amber-500/20 dark:border-amber-900 dark:border-amber-500/20",
        green: 
        "border-transparent bg-green-100 text-green-500 dark:bg-green-500/20 dark:text-green-400 dark:border-green-900",
        blue: 
        "border-transparent bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border-sky-900",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
