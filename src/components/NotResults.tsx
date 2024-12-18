"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowClockwise, Bag, House, Package } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { forwardRef } from 'react'

interface Props {
    resetFilter?: (param: string) => void;
    className?: string;
    title?: string;
    description?: string;
}

export const NotResultsFound = forwardRef<HTMLDivElement, Props>(function NotResultsFound({ resetFilter, className, description, title }, ref) {
    const { push } = useRouter()
    const path = usePathname()

    return (
        <div ref={ref} className={cn("flex flex-col items-center justify-center m-auto text-center px-4 col-span-full", className)}>
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">{title ? title : "Nessun prodotto trovato"}</h2>
            <p className="text-muted-foreground max-w-md">
                {description ? description : "Non siamo riusciti a trovare nessun prodotto che corrisponda ai tuoi criteri. Prova a modificare i filtri o i termini di ricerca."}
            </p>
            {
                path !== "/" && path !== "/cart" && path !== "/account" &&
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={() => {
                        if (path === "/") {
                            return (resetFilter as ((param: string) => void))("all")
                        }
                        push("/products")
                    }}>
                        <ArrowClockwise className="mr-2 h-4 w-4" />
                        Reimposta filtri
                    </Button>
                    <Button asChild>
                        <Link href="/">
                            <House className="mr-2 h-4 w-4" />
                            Vai alla home page
                        </Link>
                    </Button>
                </div>
            }
            {
                path === "/cart" && <Button asChild>
                    <Link href="/products">
                        <Bag className="mr-2 h-4 w-4" />
                        Continua a fare acquisti
                    </Link>
                </Button>
            }
        </div>
    )
})