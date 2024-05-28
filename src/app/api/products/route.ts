import { stripe } from "@/services/stripe/config";
import { NextRequest, NextResponse } from "next/server";

interface NextRequestProps extends NextRequest {
    userId: string;
}

export const dynamic = "force-dynamic"
export async function GET(req: NextRequestProps) {
    try {
        const products = await stripe.products.list({
            expand: ['data.default_price']
        })

        const activeProducts = products.data.filter((product) => product.active === true)

        return NextResponse.json(activeProducts)
    } catch (error) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }
}