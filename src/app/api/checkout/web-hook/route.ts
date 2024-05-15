import { stripe } from "@/services/stripe/config";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";


interface SKUProps {
    stock: number
    available_colors: { name: string, code: string, available: boolean }[]
}

export async function POST(req: NextRequest) {
    try {
        if (req.method !== 'POST') return NextResponse.json({ message: 'this method is not accepted' })

        const payload = await req.text()
        const sig = headers().get('Stripe-Signature') as string;

        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string)


        if (event.type === "checkout.session.completed") {

            const session = event.data.object as Stripe.Checkout.Session

            if (!session) return NextResponse.json({ message: `session is ${session}` }, { status: 400 })

            const metadata = session.metadata as Stripe.Metadata

            const orderId = metadata["orderId"]
            const products = JSON.parse(metadata["products"]) as { priceId: string, quantity: number }[]

            for await (const { priceId, quantity } of products) {
                const price = await stripe.prices.retrieve(priceId)
                const metadata = JSON.parse(price.metadata["SKU"]) as SKUProps
                
                await stripe.prices.update(priceId, {
                    metadata: {
                        SKU: JSON.stringify({
                            stock: (metadata.stock - quantity),
                            available_colors: metadata.available_colors
                        })
                    }
                })
            }

            await db.order.update({
                where: { id: orderId },
                data: { status: "AWAITING_SEND" }
            })

            return NextResponse.json(orderId)
        }

        return NextResponse.json(event.type)
    } catch (err) {
        return NextResponse.json({ message: err }, { status: 400 })
    }
}