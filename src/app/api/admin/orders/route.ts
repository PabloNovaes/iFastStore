import { stripe } from "@/services/stripe/config";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/client";

export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")


        if (req.headers.get('referer')?.includes("/dashboard/orders")) {

            const orders = await db.order.findMany({
                orderBy: {
                    created_at: "desc"
                }, include: {
                    adressId: true,
                    products: true
                }
            })

            const data: any = []

            for await (const order of orders) {
                const { adressId, products, ...rest } = order

                const productsArray: any = []
                for await (const product of products) {
                    const price = await stripe.prices.retrieve(product.priceId)

                    productsArray.push({ ...product, price })
                }

                data.push({ ...rest, adress: adressId, products: productsArray })

            }

            return NextResponse.json(data)
        }

        const orders = await db.order.findMany({
            orderBy: {
                created_at: "desc"
            }, include: {
                adressId: true,
            }
        })

        const data = orders.map((order) => {
            const { adressId, ...rest } = order
            return { ...rest, adress: adressId }
        })

        return NextResponse.json(data)

    } catch (err) {
        console.log(err);
        
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }
}