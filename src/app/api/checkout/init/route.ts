import { ProductsPerOrderProps } from "@/app/(store)/account/content";
import { stripe } from "@/services/stripe/config";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface SessionProductsProps extends ProductsPerOrderProps {
    model: string | null
}
export async function POST(req: NextRequest) {
    try {
        const { products, payment_method, id, shipping_tax } = await req.json()
        const user = await currentUser()

        const initOrder = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: [...(payment_method === "card" ? ["klarna", "card"] : payment_method)],
            success_url: process.env.STRIPE_SUCCESS_URL,
            shipping_options: [{
                shipping_rate_data: {
                    display_name: "normal",
                    type: "fixed_amount",
                    fixed_amount: {
                        currency: "eur",
                        amount: shipping_tax
                    }
                }
            }],
            cancel_url: process.env.STRIPE_CANCEL_URL,
            metadata: {
                user: JSON.stringify({
                    name: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                }),
                orderId: id,
                products: JSON.stringify(products.map(({ quantity, priceId }: SessionProductsProps) => ({ priceId, quantity })))
            },
            line_items: products.map(({ color, price, quantity, name, imageUrl, model }: SessionProductsProps) => {
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name,
                            images: [imageUrl],
                            description: `${color && `Colore: ${color},`} ${model && `Modello: ${model}`}`

                        },
                        unit_amount: Number(price.unit_amount).toFixed(0),
                    },
                    quantity,
                }
            }),
            // locale: "it",
            automatic_tax: {
                enabled: true,
            }

        })

        return NextResponse.json(initOrder)
    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }
}