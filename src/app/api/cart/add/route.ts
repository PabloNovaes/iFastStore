import { ShoppingCart } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";

interface Props extends ShoppingCart {
    price: Stripe.Price
}
export async function POST(req: NextRequest) {
    try {
        const product = await req.json() as Props

        const isAlredyExists = await db.shoppingCart.findMany({
            where: { productId: product.productId, userId: product.userId }
        })

        if (isAlredyExists.length === 0) {
            const { price, ...rest } = product
            await db.shoppingCart.create({ data: rest })

            revalidateTag("cart-request")
            return Response.json({ revalidated: true })
        }

        return NextResponse.json({ message: 'This product is already in your cart' })
    } catch (err) {
        return NextResponse.json({ message: "Ocurred an onexpectd error!" }, { status: 500 })
    }
}