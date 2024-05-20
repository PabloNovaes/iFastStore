import { stripe } from "@/services/stripe/config";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";

interface CreateProductProps {
    name: string;
    stock: number;
    price: number;
    nickname: string;
    category: string;
    colors: {
        name: string;
        code: string;
    }[]
}

export async function GET(req: NextRequest) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const products = await stripe.products.list({
            expand: ["data.default_price"]
        })
        const data = []

        for await (const { id, metadata, name, images, active, created, default_price } of products.data) {
            const [sales, prices] = await Promise.all([
                db.products_per_order.findMany({
                    where: {
                        productId: id
                    }
                }),
                stripe.prices.list({
                    product: id
                })

            ])

            data.push({
                id, name, created, active, sales: sales.reduce((acc, count) => {
                    return acc + count.quantity
                }, 0), metadata, images, default_price, prices: prices.data
            })
        }

        return NextResponse.json(data)

    } catch (err) {
        console.log(err);
        return NextResponse.json({}, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const { colors, name, category, price, stock, nickname } = await req.json() as CreateProductProps

        const newProduct = await stripe.products.create({
            name: name,
            metadata: {
                category,
                shipping_tax: 1499,
                colors: JSON.stringify(colors.map(({ name, code }) => ({ name, code })))
            },
            default_price_data: {
                unit_amount: price * 100,
                currency: "eur",
                tax_behavior: "unspecified",
            },
            active: true,
            expand: ['default_price']
        })

        await stripe.prices.update((newProduct.default_price as Stripe.Price).id, {
            metadata: {
                SKU: JSON.stringify({
                    stock,
                    available_colors: colors.map(({ name, code }) => ({ name, code, available: true }))
                })
            },
            nickname
        })

        return NextResponse.json({ ...newProduct, prices: [newProduct.default_price] })
    } catch (err) {
        console.log(err)
        return NextResponse.json({}, { status: 500 })
    }
}