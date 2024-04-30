import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";

interface AddToCartProps {
    productId: string
    priceId: string
    image: string
    name: string
    color: string
    userId: string
    price: Stripe.Price
}
export async function POST(req: NextRequest) {
    try {
        const { price, ...rest } = await req.json() as AddToCartProps

        const isAlredyExists = await db.shoppingCart.findMany({
            where: { productId: rest.productId, userId: rest.userId }
        })

        if (isAlredyExists.length === 0) {
            await db.shoppingCart.create({ data: rest })

            revalidateTag("cart-request")
            return Response.json({ revalidated: true })
        }

        return NextResponse.json({ message: 'This product is already in your cart' })
    } catch (err) {
        console.log('erro', err)
    }
}