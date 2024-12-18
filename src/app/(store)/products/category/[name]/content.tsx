'use client'


import { NotResultsFound } from "@/components/NotResults"
import { ProductCard } from "@/components/ProductCard"
import { ProductCardSkeleton } from "@/components/ProductCard-Skeleton"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import Stripe from "stripe"

const categories = {
    iphone: "iPhone",
    headphone: "Cuffie",
    notebooks: "Notebooks",
    accessories: "Acessori",
    software: "Software",
} as { [key: string]: string }

export function Products() {
    const [products, setProducts] = useState<Stripe.Product[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { name } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/products", {
                    method: 'GET',
                    next: {
                        tags: ['all-products']
                    }
                })
                const data = await response.json() as Stripe.Product[]
                const filteredProducts = data.filter(product => product.metadata.category.toLowerCase().startsWith(name[0]))

                setProducts(filteredProducts)
            } catch (err) {
                toast.error("Si è verificato un errore imprevisto!")
                throw err
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [name])

    return (
        <main className="px-5 flex flex-col gap-6 max-w-5xl m-auto pt-5" style={{ minHeight: "calc(100svh - 90px)" }}>
            <div className="w-full py-5 flex justify-between items-center">
                <h1 className="text-xl font-semibold">{categories[name as string]}</h1>
            </div>

            <div className="grid gap-5 grid-cols-2 pb-5 md:grid-cols-3 lg:grid-cols-4">
                {!products && isLoading && Array.from({ length: 4 }).map(() => <ProductCardSkeleton key={Math.random()} />)}
                {products && !isLoading && products.length > 0 && products.map((product) => <ProductCard key={product.id} product={product} />)}
                {products && !isLoading && products.length === 0 && <NotResultsFound />}
            </div>
        </main>
    )
}