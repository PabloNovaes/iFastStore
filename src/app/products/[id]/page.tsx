import { ProductData } from "@/components/ProductData"
import { stripe } from "@/lib/stripe/config"

import Image from "next/image"
import Loading from "./loading"

import { Suspense } from "react"

interface Props {
    params: { id: string }
}

export default async function Products({ params }: Props) {
    const getProduct = stripe.products.retrieve(params.id, {
        expand: ['default_price']
    })

    const getPrices = stripe.prices.list({
        product: params.id
    })

    const [product, prices] = await Promise.all([getProduct, getPrices])

    return (
        <>
            <Suspense fallback={<Loading />} >
                <main className=" max-w-5xl m-auto py-4 px-4 flex flex-col" style={{ minHeight: 'calc(100dvh - 50px)' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-8 flex-1">
                        <div className="rounded-[30px] py-3 flex items-center bg-accent relative min-h-[260px]">
                            <Image src={product.images[0]} priority quality={100}
                                layout="fill" alt="product image" style={{ maxWidth: 200, objectFit: 'contain', margin: '0 auto', paddingBlock: 10 }} />
                        </div>
                        <ProductData prices={prices.data.sort((a, b) => Number(a.unit_amount) - Number(b.unit_amount))} product={product} />
                    </div>
                </main>
            </Suspense>
        </>
    )
}