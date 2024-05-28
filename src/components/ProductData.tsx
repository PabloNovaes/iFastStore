'use client'

import { Product } from "@/app/(admin)/dashboard/products/content"
import { useAuth } from "@clerk/nextjs"
import { useRef, useState } from "react"
import { toast } from "sonner"
import Stripe from "stripe"
import { CartProduct } from "../app/(store)/cart/content"
import { ProductColorSelector } from "./ProductColorSelector"
import { ProductModelSelector } from "./ProductModelSelector"

interface Props extends Omit<Product, "sales"> {
    onSetFilterImagesToColor: (color: string) => void
}

export function ProductData({ default_price, prices, name, id, images, onSetFilterImagesToColor, metadata, description }: Props) {
    const { userId } = useAuth()
    const [model, setModel] = useState<string>(prices[0].id)

    const SKU = JSON.parse(model !== null ? prices.filter(price => price.id === model)[0].metadata['SKU'] : prices[0].metadata['SKU'])
    const colors = SKU.available_colors as { name: string, code: string, available: boolean }[]

    const [activeColor, setActiveColor] = useState<string | null>(null)
    const price = default_price as Stripe.Price

    const formRef = useRef(null)

    function handleProductData(): CartProduct | null | any {
        if (formRef.current === null) return null

        const form = formRef.current as HTMLFormElement
        const { color, price_id } = Object.fromEntries(new FormData(form).entries()) as { color: string, price_id: string }

        if (!color) return toast.error("Seleziona un colore")

        const priceId = price_id ? price_id : price.id

        return {
            color,
            productId: id,
            userId,
            shipping_tax: Number(metadata["shipping_tax"]),
            name: name,
            image: images[0].url,
            priceId,
            price: prices.find(price => price.id === priceId)
        }
    }


    const inStock = (prices.reduce((acc, count) => {
        const sku = JSON.parse(count.metadata["SKU"]) as { stock: number }
        return acc + Number(sku.stock)
    }, 0)) > 0

    const handleSetActiveColor = (name: string) => {
        setActiveColor(name)
        onSetFilterImagesToColor(name)
    }

    const handleSetModel = (id: string) => setModel(id)

    return (
        <form ref={formRef} className="flex flex-col gap-8" action={async () => {
            try {
                const data = handleProductData()

                if (data === null) return

                await fetch('/api/cart/add', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                toast.success("Prodotto aggiunto al carrello")
            } catch (err) {
                return err
            }
        }} >
            <header className="flex flex-col justify-between items-start gap-4">
                <h1 className="text-4xl font-medium">{name}</h1>
                {description !== "" && <p>{description}</p>}
            </header>

            <div className="grid gap-2">
                <p>
                    <span className="font-semibold mr-1">Colore:</span>{activeColor}
                </p>
            </div>
            <ProductColorSelector
                modelCount={prices.length}
                handleSetActiveColor={handleSetActiveColor}
                inStock={inStock}
                colors={colors}
                hasModelSelected={model} />
            <ProductModelSelector
                activeColor={activeColor}
                prices={prices}
                defaultPrice={Number(price.unit_amount)}
                getProductData={handleProductData}
                onSetModel={handleSetModel} />
        </form>

    )
}