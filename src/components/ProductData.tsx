'use client'

import { addCart } from "@/app/actions"
import { useAuth } from "@clerk/nextjs"
import { useRef, useState } from "react"
import Stripe from "stripe"
import { CartProduct } from "../app/cart/page"
import { ColorProps } from "./ProductCard"
import { ProductColorSelector } from "./ProductColorSelector"
import { ProductModelSelector } from "./ProductModelSelector"

interface ProductDataProps {
    product: Stripe.Product;
    prices: Stripe.Price[];
}

export function ProductData(props: ProductDataProps) {
    const { product, prices: productPrices } = props as ProductDataProps
    const { default_price, metadata } = product
    const { userId } = useAuth()

    const colors: ColorProps[] = JSON.parse(metadata.colors)

    const [activeColor, setActiveColor] = useState<string>(colors[0].name)
    const price = default_price as Stripe.Price


    const prices = productPrices.filter(x => x.active === true)
    const formRef = useRef(null)

    function add(): CartProduct | null {
        if (formRef.current === null) return null
        
        const form = formRef.current as HTMLFormElement
        const { color, price_id } = Object.fromEntries(new FormData(form).entries()) as { color: string, price_id: string }

        const priceId = price_id ? price_id : price.id

        return {
            color,
            productId: product.id,
            userId,
            name: product.name,
            image: product.images[0],
            priceId,
            price: prices.filter(price => price.id === priceId)[0]
        }
    }


    const handleSetActiveColor = (name: string) => setActiveColor(name)

    return (
        <form ref={formRef} className="flex flex-col gap-8" action={async () => {
            const data = add() as CartProduct
            await addCart(data)
        }} >
            <header className="flex justify-between items-center">
                <h1 className="text-4xl font-medium">{product.name}</h1>
            </header>

            <div className="grid gap-2">
                <p>
                    <span className="font-semibold mr-1">Colore:</span>{activeColor}
                </p>
            </div>
            <ProductColorSelector handleSetActiveColor={handleSetActiveColor} colors={colors} />
            <ProductModelSelector prices={prices} defaultPrice={Number(price.unit_amount)} getProductData={add} />
        </form>

    )
}