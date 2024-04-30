import { stripe } from "@/lib/stripe/config";
import { NextResponse } from "next/server";


export async function GET(context: any) {
    try {
        const { params } = context

        const product = await stripe.products.retrieve(params.id, {
            expand: ['default_price']
        })

        const prices = await stripe.prices.list({
            product: params.id
        })

        return NextResponse.json({ product, prices })
    } catch (error) {
        return NextResponse.json({ error })
    }
}