'use client'


import { ProductCard } from "@/components/ProductCard"
import { ProductCardSkeleton } from "@/components/ProductCard-Skeleton"
import { ArrowDown, ArrowUp } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


import Stripe from "stripe"

export default function Search() {
    const [products, setProducts] = useState<Stripe.Product[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const path = usePathname()
    const searchParams = useSearchParams()

    const query = searchParams.get('name')
    const sortBy = searchParams.get('sort-by') as string

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
                const filteredProducts = data.filter(product => product.name.toLowerCase().startsWith(query ? query : ''))

                setProducts(filteredProducts)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [query])

    const sortingMethods: {
        [key: string]: (products: Stripe.Product[]) => Stripe.Product[]
    } = {
        lowest_price: (products: Stripe.Product[]) => {
            return products.sort((a, b) => {
                const aPrice = a.default_price as Stripe.Price
                const bPrice = b.default_price as Stripe.Price

                return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
            })
        },
        biggest_price: (products: Stripe.Product[]) => {
            return products.sort((a, b) => {
                const aPrice = a.default_price as Stripe.Price
                const bPrice = b.default_price as Stripe.Price

                return Number(bPrice.unit_amount) - Number(aPrice.unit_amount)
            })
        }
    }

    return (

        <main className="px-5 flex flex-col gap-4 max-w-5xl m-auto pt-5">
            <div className="w-full py-5 flex flex-col">
                <h1 className="text-xl font-semibold">
                    {
                        query == null
                            ? 'Tutti i prodotti'
                            : `Resultati per "${query}"`
                    }
                </h1>
                <RadioGroup className="filter-selector flex gap-3 text-sm flex-1 mt-4">
                    <Link href={`${path}?sort-by=lowest_price`}>
                        <RadioGroupItem key={'lowest_price'} value={'lowest-price'} className="border px-4 py-1 rounded-2xl data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center gap-2 transition-colors duration-300">
                            Prezo
                            <ArrowDown size={14} />
                        </RadioGroupItem>
                    </Link>
                    <Link href={`${path}?sort-by=biggest_price`}>
                        <RadioGroupItem key={'biggest_price'} value={'biggest-price'} className="border px-4 py-1 rounded-2xl data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center gap-2 transition-colors duration-300">
                            Prezo
                            <ArrowUp size={14} />
                        </RadioGroupItem>
                    </Link>
                </RadioGroup>
            </div>

            <div className="grid gap-5 grid-cols-2 pb-5 md:grid-cols-3 lg:grid-cols-4">
                {isLoading && Array.from({ length: 8 }).map(() => <ProductCardSkeleton key={Math.random()} />)}
                {!isLoading && sortBy !== null
                    ? [...sortingMethods[sortBy](products)].map((product) => <ProductCard key={product.id} product={product} />)
                    : products.map((product) => <ProductCard key={product.id} product={product} />)
                }

            </div>
        </main>
    )
}
