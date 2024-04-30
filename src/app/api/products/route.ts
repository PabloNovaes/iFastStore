import { stripe } from "@/lib/stripe/config";
import { NextRequest, NextResponse } from "next/server";

interface NextRequestProps extends NextRequest {
    userId: string;
}
export async function GET(req: NextRequestProps) {
    try {
        const products = await stripe.products.list({
            expand: ['data.default_price']
        })

        const activeProducts = products.data.filter((product) => product.active === true)

        return NextResponse.json(activeProducts)
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error })
    }
}