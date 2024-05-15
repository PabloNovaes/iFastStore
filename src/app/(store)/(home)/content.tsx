'use client'

import { CardsSection } from "@/components/CardsSection";
import { FilterSelector } from "@/components/FilterSelector";
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

    const onSelectFilter = (filter: string) => { setFilter(filter) }

    return (
        <>

            <main className="px-5 flex flex-col gap-6 max-w-5xl m-auto pt-5">
                <CardsSection />
                <FilterSelector handleFilter={onSelectFilter} />
                <div className="grid gap-5 grid-cols-2 pb-5 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading && Array.from({ length: 4 }).map(() => <ProductCardSkeleton key={Math.random()} />)}

                    {!isLoading && filter !== 'all'
                        ? products
                            .filter(x => x.metadata.category.toLowerCase() === filter)
                            .map((product) => <ProductCard key={product.id} product={product} />)

                        : products.map((product) => <ProductCard key={product.id} product={product} />)

                    }
                </div>
            </main>
        </>
    );
}

