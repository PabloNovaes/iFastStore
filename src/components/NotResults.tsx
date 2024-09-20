"use client"

import { Button } from "@/components/ui/button"
import { ArrowClockwise, House, Package } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface Props {
    resetFilter?: (param: string) => void;
}

export function NotResultsFound({ resetFilter }: Props) {
    const { push } = useRouter()
    const path = usePathname()

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] m-auto text-center px-4 col-span-full">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nessun prodotto trovato</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Non siamo riusciti a trovare nessun prodotto che corrisponda ai tuoi criteri. Prova a modificare i filtri o i termini di ricerca.
            </p>
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
                {path !== "/" && <Button asChild>
                    <Link href="/">
                        <House className="mr-2 h-4 w-4" />
                        Vai alla home page
                    </Link>
                </Button>}
            </div>
        </div >
    )
}