import { stripe } from "@/services/stripe/config";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface SKUProps {
    priceId: string
    price: number
    stock: number
    available_colors: { name: string, code: string, available: boolean }[]
}


export async function GET(req: NextRequest) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        return NextResponse.json({})

    } catch (err) {
        console.log(err);
        return NextResponse.json({}, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json() as SKUProps        

        const updateSku = await stripe.prices.update(data.priceId, {
            metadata: {
                SKU: JSON.stringify({ stock: data.stock, available_colors: data.available_colors })
            }
        })

        return NextResponse.json(updateSku)

    } catch (err) {
        return NextResponse.json("Ocurred an unxpected error", { status: 500 })
    }
}