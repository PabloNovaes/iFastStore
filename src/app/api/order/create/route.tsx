import { CartProduct } from "@/app/cart/page";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { products, userId, adressId, payment_method } = await req.json()

        const order = await db.order.create({
            data: {
                status: "AWAITING_PAYMENT",
                userId,
                adressesId: adressId,
                payment_method,
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
        console.log(err);

        return NextResponse.json({ message: err, code: 500 })
    }
}