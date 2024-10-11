'use client'

import { Product } from "@/app/(admin)/dashboard/products/content"
import { useAuth } from "@clerk/nextjs"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import Stripe from "stripe"
import { CartProduct } from "../app/(store)/cart/content"
import { ProductColorSelector } from "./ProductColorSelector"
import { ProductModelSelector } from "./ProductModelSelector"

interface Props extends Omit<Product, "sales"> {
    onSetFilterImagesToColor: (color: string) => void
    category: string;
}

export function ProductData({ default_price, prices, name, id, images, onSetFilterImagesToColor, metadata, description, category }: Props) {
    const { userId } = useAuth()
    const [model, setModel] = useState<string>(prices[0].id)
    const [activeColor, setActiveColor] = useState<string | null>(null)

    const SKU = useMemo(() => {
        const selectedPrice = prices.find(price => price.id === model) || prices[0]
        return JSON.parse(selectedPrice.metadata['SKU'])
    }, [model, prices])

    const colors = useMemo(() => SKU.available_colors as { name: string, code: string, available: boolean }[], [SKU])

    const price = default_price as Stripe.Price

    const inStock = useMemo(() => prices.some(price => {
        const sku = JSON.parse(price.metadata["SKU"]) as { stock: number }
        return sku.stock > 0
    }), [prices])

    const handleProductData = useCallback((): CartProduct | null => {
        if (category !== "software" && !activeColor) {
            toast.error("Seleziona un colore")
            return null
        }
    
        const selectedPrice = prices.find(p => p.id === model) || price
    
        const baseProduct = {
            category,
            productId: id,
            userId: userId as string,
            shipping_tax: Number(metadata["shipping_tax"]),
            name: name,
            image: images[0].url,
            priceId: selectedPrice.id,
            price: selectedPrice,
            ...(category !== "software" && activeColor && {
                color: activeColor
            })
        }
    
        return baseProduct
    }, [activeColor, category, model, prices, price, id, userId, metadata, name, images])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const data = handleProductData()
            if (data) {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                if (!response.ok) throw new Error('Failed to add to cart')
                toast.success("Prodotto aggiunto al carrello")
            }
        } catch (err) {
            console.error(err)
            toast.error("Errore nell'aggiunta al carrello")
        }
    }

    const handleSetActiveColor = useCallback((name: string) => {
        setActiveColor(name)
        onSetFilterImagesToColor(name)
    }, [onSetFilterImagesToColor])

    const priceNickname = useMemo(() => {
        const selectedPrice = prices.find(price => price.id === model)
        return selectedPrice ? selectedPrice.nickname : ''
    }, [model, prices])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <header className="flex flex-col justify-between items-start gap-4">
                <h1 className="text-4xl font-medium">
                    {name}{priceNickname !== "Padrão" && ` - ${priceNickname}`}
                </h1>
                {description && <p>{description}</p>}
            </header>

            {category !== "software" && (
                <div className="grid gap-2 items-start">
                    <p>
                        <span className="font-semibold mr-1">Colore:</span>{activeColor}
                    </p>
                    <ProductColorSelector
                        modelCount={prices.length}
                        handleSetActiveColor={handleSetActiveColor}
                        inStock={inStock}
                        colors={colors}
                        hasModelSelected={!!model}
                    />
                </div>
            )}
            <ProductModelSelector
                category={category}
                activeColor={activeColor}
                prices={prices}
                defaultPrice={Number(price.unit_amount)}
                getProductData={handleProductData}
                onSetModel={setModel}
            />
        </form>
    )
}