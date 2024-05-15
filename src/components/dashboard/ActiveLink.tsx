'use client'

import { ChartLine, House, Package, ShoppingCart, Users } from "@phosphor-icons/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { SheetClose } from "../ui/sheet"

const sidebarLinks: { path: string, icon: ReactNode, title: string }[] = [
    { title: "Dashboard", path: "/dashboard", icon: <House className="h-5 w-5" /> },
    { title: "Pedidos", path: "/dashboard/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Produtos", path: "/dashboard/products", icon: <Package className="h-5 w-5" /> },
    { title: "Usuários", path: "/dashboard/customers", icon: <Users className="h-5 w-5" /> },
    { title: "Analytics", path: "/dashboard/anaytics", icon: <ChartLine className="h-5 w-5" /> }
]

export function DesktopActiveLink() {
    const currentPath = usePathname()

    return (
        <TooltipProvider>
            {sidebarLinks.map(({ path, icon, title }) => (
                <Tooltip key={path}>
                    <TooltipTrigger asChild>
                        <Link
                            href={path}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                            ${currentPath === path && 'bg-accent text-primary'}
                            `}>
                            {icon}
                            <span className="sr-only">{title}</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
    )
}

export function MobileActiveLink() {
    const currentPath = usePathname()

    return sidebarLinks.map(({ path, icon, title }) => (
        <SheetClose key={path} asChild>
            <Link
                href={path}
                className={`flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foregrounde  ${currentPath === path && 'text-primary'}`}>
                {icon}
                {title}
                <span className="sr-only">Acme Inc</span>
            </Link>
        </SheetClose>
    ))
}

