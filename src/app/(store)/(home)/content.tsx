'use client'

import { CardsSection } from "@/components/CardsSection";
import { FilterSelector } from "@/components/FilterSelector";
import { NotResultsFound } from "@/components/NotResults";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCard-Skeleton";
import { useEffect, useState } from "react";

import Stripe from "stripe";

export function Home() {
    const [products, setProducts] = useState<Stripe.Product[]>([])
    const [filter, setFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        const getProducts = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/products", {
                    method: 'GET',
                    next: {
                        tags: ["all-products"]
                    }
                    , cache: "no-store"
                })
                const data = await response.json() as Stripe.Product[]
                setProducts(data)
            } catch (error) {
                throw error
            } finally {
                setIsLoading(false)
            }
        }

        getProducts()
    }, [])

    const onSelectFilter = (filter: string) => setFilter(filter)

    const filteredProducts = filter === "all" ? products : products.filter(product => product.metadata.category.toLowerCase() === filter)
    return (
        <>
            <main className="px-5 flex flex-col gap-6 max-w-5xl m-auto pt-5" style={{ minHeight: "calc(100svh - 50px)" }} >
                <CardsSection />
                <FilterSelector handleFilter={onSelectFilter} currentFilter={filter} />
                <div className="grid gap-5 grid-cols-2 pb-5 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading && Array.from({ length: 8 }).map(() => <ProductCardSkeleton key={Math.random()} />)}
                    {filteredProducts.length !== 0 && !isLoading && filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    {filteredProducts.length === 0 && !isLoading && <NotResultsFound resetFilter={onSelectFilter} />}
                </div>
            </main>
        </>
    );
}

