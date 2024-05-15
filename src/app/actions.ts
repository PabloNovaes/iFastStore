'use server'

import { stripe } from "@/services/stripe/config";
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
        return await stripe.products.update(id, {
            images: [url]
        })
    } catch (err) {
        throw err
    }
}
export async function upadteShippingTax({ id, value }: { id: string, value: number }) {
    try {
        return await stripe.products.update(id, {
            metadata: {
                ["shipping_tax"]: value
            }
        })
    } catch (err) {
        throw err
    }
}
export async function deleteProductThumb(id: string) {
    try {
        return await stripe.products.update(id, {
            images: []
        })
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







