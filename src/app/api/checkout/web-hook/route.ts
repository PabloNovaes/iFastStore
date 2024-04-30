import { stripe } from "@/lib/stripe/config";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";


export async function POST(req: NextRequest) {
    try {
        if (req.method !== 'POST') return NextResponse.json({ message: 'this method is not accepted' })

        const payload = await req.text()
        const signature = req.headers.get("stripe-signature") as string
        const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET as string)


        if (event.type === "checkout.session.completed") {

            const session = event.data.object as Stripe.Checkout.Session

            if (!session) return NextResponse.json({ message: `session is ${session}` }, { status: 400 })

            const metadata = session.metadata as Stripe.Metadata

            const orderId = metadata["orderId"]

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