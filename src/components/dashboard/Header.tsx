'use client'

import { UserButton } from "@clerk/nextjs";
import { Lightning } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MobileActiveLink } from "./ActiveLink";

const pathsLink: { [key: string]: string } = {
    dashboard: "/dashboard",
    orders: "/dashboard/orders",
    products: "/dashboard/products",
    customers: "/dashboard/customers",
    analytics: "/dashboard/anaytics"
}

export function Header() {
    const path = usePathname()
    const paths = path.split("/")
    paths.shift()

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <Image src="/assets/icons/menu.svg" alt="menu icon" height={18} width={18} />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/">
                            <div className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                                <Lightning weight="fill" className="h-4 w-4 transition-all group-hover:scale-110" />
                                <span className="sr-only">iFast Store</span>
                            </div>
                        </Link>
                        <MobileActiveLink />
                    </nav>
                </SheetContent>
            </Sheet>
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    {paths.map((pathname, indx) => (
                        <>
                            <BreadcrumbItem key={pathname}>
                                <BreadcrumbLink asChild>
                                    <p>{pathname}</p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {paths.length > 1 && indx + 1 < paths.length && <BreadcrumbSeparator />}
                        </>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            {/* <div className="relative ml-auto flex-1 md:grow-0">
                <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
            </div> */}
            <UserButton />
        </header>
    )
}

