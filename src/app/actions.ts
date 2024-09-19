'use server'

import { stripe } from "@/services/stripe/config";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { db } from "../../prisma/client";

export interface CreateSkuProps {
    id: string,
    price: number,
    stock: number,
    identifier: string,
    colors: {
        name: string, code: string
    }[]
}

export async function changeProductStatus({ id, active }: { id: string, active: boolean }) {
    try {
        await stripe.products.update(id, { active })

    } catch (err) {
        return err
    }
}
export async function changeProductCategory({ id, data }: { id: string, data: Stripe.Metadata }) {
    try {
        await stripe.products.update(id, { metadata: data })
    } catch (err) {
        return err
    }
}
export async function UpadteProductThumb({ id, url }: { id: string, url: string }) {
    try {
        await stripe.products.update(id, {
            images: [url]
        })
        revalidatePath('/products/[id]')
    } catch (err) {
        throw err
    }
}
export async function upadteShippingTax({ id, value }: { id: string, value: number }) {
    try {
        await stripe.products.update(id, {
            metadata: {
                ["shipping_tax"]: value
            }
        })
        revalidatePath('/products/[id]', "page")

    } catch (err) {
        throw err
    }
}
export async function updateProductDescription({ id, description }: { id: string, description: string }) {
    try {
        await stripe.products.update(id, {
            description
        })
        revalidatePath('/products/[id]', "page")

    } catch (err) {
        throw err
    }
}
export async function updateProductName({ id, name }: { id: string, name: string }) {
    try {
        await stripe.products.update(id, {
            name
        })
        revalidatePath('/products/[id]', "page")

    } catch (err) {
        throw err
    }
}
export async function deleteProductThumb(id: string, newThumbImage: string) {
    try {
        await stripe.products.update(id, {
            images: [newThumbImage]
        })
        revalidatePath('/products/[id]')

    } catch (err) {
        throw err
    }
}
export async function createNewSku({ price, stock, identifier, id, colors }: CreateSkuProps) {
    try {
        const newSku = await stripe.prices.create({
            product: id,
            currency: 'eur',
            unit_amount: price * 100,
            nickname: identifier,
            metadata: {
                SKU: JSON.stringify({
                    stock,
                    available_colors: colors.map(({ name, code }) => ({ name, code, available: true }))
                })
            }
        })
        revalidatePath('/products')
        revalidatePath('/products/[id]')

        return newSku
    } catch (err) {
        throw err
    }
}
export async function confirmDelivery(orderId: string) {
    try {
        return await db.order.update({
            where: {
                id: orderId
            },
            data: {
                status: "ORDER_DELIVERED"
            }
        })
    } catch (err) {
        throw err
    }
}
export async function addNewProductColors({ id, colors }: { id: string, colors: { name: string, code: string }[] }) {
    try {
        const addNewColorsInProduct = stripe.products.update(id, {
            metadata: {
                ["colors"]: JSON.stringify(colors),
            }
        })
        const loadPrices = stripe.prices.list({
            product: id,
        })

        const [newColors, prices] = await Promise.all([addNewColorsInProduct, loadPrices])

        const updatedSkuColors = []

        for (let { metadata, id: priceId } of prices.data) {
            const updateAvailableColors = await stripe.prices.update(priceId, {
                metadata: {
                    SKU: JSON.stringify({
                        stock: (JSON.parse(metadata.SKU) as any).stock,
                        available_colors: [...colors.map(({ name, code }) => ({ name, code, available: true }))]
                    })
                }
            })
            updatedSkuColors.push(updateAvailableColors)
        }

        return {
            colors: JSON.parse(newColors.metadata["colors"]) as { name: string, code: string }[],
            updatedPrices: updatedSkuColors
        }
    } catch (err) {
        throw err
    }
}
export async function deleteProductColor({ id, colors, removeColor }: { id: string, removeColor: { name: string, code: string }, colors: { name: string, code: string }[] }) {
    try {
        const addNewColorsInProduct = stripe.products.update(id, {
            metadata: {
                ["colors"]: JSON.stringify(colors),
            }
        })
        const loadPrices = stripe.prices.list({
            product: id,
        })

        const [newColors, prices] = await Promise.all([addNewColorsInProduct, loadPrices])

        const updatedSkuColors = []

        for (let { metadata, id: priceId } of prices.data) {
            const available_colors = (JSON.parse(metadata.SKU) as any).available_colors as { name: string, code: string, available: boolean }[]
            const updateAvailableColors = await stripe.prices.update(priceId, {
                metadata: {
                    SKU: JSON.stringify({
                        stock: (JSON.parse(metadata.SKU) as any).stock,
                        available_colors: available_colors.filter(color => color.name !== removeColor.name)
                    })
                }
            })
            updatedSkuColors.push(updateAvailableColors)
        }

        return {
            colors: JSON.parse(newColors.metadata["colors"]) as { name: string, code: string }[],
            updatedPrices: updatedSkuColors
        }
    } catch (err) {
        throw err
    }
}