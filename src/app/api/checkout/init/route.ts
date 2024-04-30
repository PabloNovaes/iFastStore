import { ProductsPerOrderProps } from "@/app/account/page";
import { stripe } from "@/lib/stripe/config";
import { NextRequest, NextResponse } from "next/server";

interface SessionProductsProps extends ProductsPerOrderProps {
    model: string | null
}
export async function POST(req: NextRequest) {
    try {
        const { products, payment_method, id } = await req.json()

        const initOrder = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: [payment_method],
            success_url: "http://192.168.0.174:3000/account",
            cancel_url: "http://192.168.0.174:3000/account",
            metadata: {
                orderId: id
            },
            line_items: products.map(({ color, price, quantity, name, imageUrl, model }: SessionProductsProps) => {
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name,
                            images: [imageUrl],
                            description: model !== null ? `Color: ${color}, model: ${model}` : `Color: ${color}`

                        },
                        unit_amount: Number(price.unit_amount).toFixed(0),
                    },
                    quantity,
                }
            })

        })

        return NextResponse.json(initOrder)
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err, code: 500 })
    }
}