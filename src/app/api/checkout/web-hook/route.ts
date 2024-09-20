import { stripe } from "@/services/stripe/config";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../prisma/client";

interface SKUProps {
    stock: number;
    available_colors: { name: string; code: string; available: boolean }[];
}

export async function POST(req: NextRequest) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
        }

        const payload = await req.text();
        const sig = headers().get("Stripe-Signature");

        if (!sig) {
            return NextResponse.json({ message: "Missing Stripe signature" }, { status: 400 });
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
        } catch (error) {
            return NextResponse.json({ message: "Invalid Stripe signature" }, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session) {
                return NextResponse.json({ message: "Session not found" }, { status: 400 });
            }

            const metadata = session.metadata as Stripe.Metadata;
            const orderId = metadata["orderId"];
            const products = JSON.parse(metadata["products"]) as { priceId: string; quantity: number }[];
            const userData = JSON.parse(metadata["user"]) as { name: string; email: string };

            for (const { priceId, quantity } of products) {
                const price = await stripe.prices.retrieve(priceId);

                const skuMetadata = JSON.parse(price.metadata["SKU"]) as SKUProps;

                await stripe.prices.update(priceId, {
                    metadata: {
                        SKU: JSON.stringify({
                            stock: skuMetadata.stock - quantity,
                            available_colors: skuMetadata.available_colors,
                        }),
                    },
                });
            }

            await db.order.update({
                where: { id: orderId },
                data: { status: "AWAITING_SEND" },
            });

            const existingCustomers = await stripe.customers.list({
                email: userData.email,
            });

            if (existingCustomers.data.length === 0) {
                await stripe.customers.create({
                    email: userData.email,
                    name: userData.name,
                });
            }

            return NextResponse.json({ orderId });
        }

        return NextResponse.json({ message: `Unhandled event type: ${event.type}` });
    } catch (error) {
        console.error("Error handling webhook: ", error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
