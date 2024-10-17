'use client'

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { forwardRef } from 'react'

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const ToggleTheme = forwardRef<HTMLButtonElement, ButtonProps>(function ToggleTheme({ className, ...props }, ref) {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            ref={ref}
            className={cn("flex justify-center items-center", className)}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
            {...props}
        >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
})

ToggleTheme.displayName = 'ToggleTheme'