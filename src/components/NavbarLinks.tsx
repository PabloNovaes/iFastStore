"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

const sidebarLinks: { path: string, title: string }[] = [
    { title: "Home", path: "/" },
    { title: "Prodotti", path: "/products" },
    { title: "Account", path: "/account" },
    { title: "Dashboard", path: "/dashboard" },
]

type AnimatedTabsProps = {
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    isAdmin: boolean;
    currentPath: string;
};

const tabs: { path: string, title: string }[] = [
    { title: "Home", path: "/" },
    { title: "Prodotti", path: "/products" },
    { title: "Account", path: "/account" },
    { title: "Dashboard", path: "/dashboard" },
]

export function NavbarLinks({
    activeTabClassName,
    tabClassName,
    isAdmin,
    currentPath
}: AnimatedTabsProps) {
    const [activeIdx, setActiveIdx] = useState<number>(-1);

    useEffect(() => {
        const index = tabs.findIndex(tab => currentPath === tab.path);
        setActiveIdx(index);
    }, [currentPath]);

    return (
        <>
            {tabs.map(({ title, path }, index) => {
                if (!isAdmin && path === "/dashboard") return null;
                return (
                    <Link href={path}
                        key={title}
                        onClick={() => setActiveIdx(index)}
                        className={cn(
                            "group flex justify-center relative z-[1] rounded-full px-4 py-1",
                            { "z-0": activeIdx === index },
                            tabClassName
                        )}
                    >
                        {activeIdx === index && (
                            <motion.div
                                layoutId="clicked-button"
                                transition={{ duration: 0.35, ease: "backInOut" }}
                                className={cn(
                                    "absolute w-[84%] mx-auto inset-0 rounded-full bg-muted/40 border shadow-sm",
                                    activeTabClassName
                                )}
                            />
                        )}

                        <span key={path}

                            className={cn("flex h-5 z-20 relative items-center justify-center rounded-lg text-muted-foreground transition-colors ", index === activeIdx && "text-primary")}>
                            {title}
                        </span>
                    </Link>
                )
            })}
        </>
    );
}
