import { stripe } from "@/services/stripe/config";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../prisma/client";

export async function PUT(req: NextRequest) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const { code, id } = await req.json()
        
        const updateOrder = await db.order.update({
            where: { id }, data: {
                shipping_code: code,
                status: "ORDER_DISPATCHED"
            }, include: {
                adressId: true,
                products: true
            }
        })

        const { adressId, ...rest } = updateOrder

        const productsArray: any = []

        for await (const { priceId, ...rest } of updateOrder.products) {
            const price = await stripe.prices.retrieve(priceId)
            productsArray.push({ ...rest, price })
        }

        return NextResponse.json({
            ...rest, adress: adressId, products: productsArray
        })

    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }
}