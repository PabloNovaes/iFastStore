import { stripe } from "@/services/stripe/config";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/client";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId') as string
        const findProducts = await db.shoppingCart.findMany({
            where: { userId }
        })

        if (findProducts.length === 0) {
            return NextResponse.json('Your shopping cart is empty')
        }

        const products = []

        for (const product of findProducts) {
            const getProductPrice = await stripe.prices.retrieve(product.priceId)

            products.push({ ...product, price: getProductPrice })
        }

        console.log(products);

        return NextResponse.json(products)
    } catch (err) {
        console.log(err);

        return NextResponse.json({ code: 500, message: err })
    }
}