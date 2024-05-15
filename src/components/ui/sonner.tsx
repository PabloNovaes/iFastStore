"use client"

import { CheckCircle, XCircle } from "@phosphor-icons/react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      icons={{
        error: <XCircle size={18} />,
        success: <CheckCircle size={18} />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "border-transparent bg-[#ffe7f2] text-[#df1b41]",
          success: "border-transparent bg-[#d7f7c2] text-[#006908]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
