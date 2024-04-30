import { stripe } from "@/lib/stripe/config";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/client";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId') as string
        const getOrders = await db.order.findMany({
            where: { userId },
            include: { products: true }
        })

        const orders: any = []

        for await (const order of getOrders) {
            const { products, ...rest } = order
            const productsArray: any = []

            for (const product of products) {
                const price = await stripe.prices.retrieve(product.priceId)
                productsArray.push({ ...product, price })
            }

            orders.push({ ...rest, products: productsArray })
        }


        return NextResponse.json(orders)
    } catch (err) {
        return NextResponse.json({ messgae: err, code: 500 })
    }
}