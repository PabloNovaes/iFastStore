import { CartProduct } from "@/app/(store)/cart/content";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { products, userId, adressId, payment_method, total, shipping_tax } = await req.json()

        if(!products) throw new Error("Products is missing")

        const order = await db.order.create({
            data: {
                status: "AWAITING_PAYMENT",
                userId,
                adressesId: adressId,
                payment_method,
                shipping_tax,
                total
            }
        })

        products.map(async ({ color, image, name, productId, priceId, quantity, id }: CartProduct) => {
            await Promise.all([
                db.products_per_order.create({
                    data: {
                        productId,
                        name,
                        priceId,
                        quantity: Number(quantity),
                        color,
                        imageUrl: image,
                        orderId: order.id
                    }
                }),
                db.shoppingCart.deleteMany({ where: { id, userId } })
            ])
        })



        return NextResponse.json(order)
    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }
}