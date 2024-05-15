import { ShoppingCart } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
    try {
        const product = await req.json() as ShoppingCart

        const isAlredyExists = await db.shoppingCart.findMany({
            where: { productId: product.productId, userId: product.userId }
        })

        if (isAlredyExists.length === 0) {
            await db.shoppingCart.create({ data: product })

            revalidateTag("cart-request")
            return Response.json({ revalidated: true })
        }

        return NextResponse.json({ message: 'This product is already in your cart' })
    } catch (err) {
        console.log('erro', err)
    }
}