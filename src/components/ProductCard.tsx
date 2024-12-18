'use client'

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Stripe from "stripe";

export interface ColorProps {
    name: string
    code: string
}

const variants = {
    hidden: {
        opacity: 0,
        y: 25
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.2,
            bounce: 0,
            type: "spring",
            delay: 0.2
        }
    },
}
export function ProductCard({ product }: { product: Stripe.Product }) {
    const { name, metadata, default_price, id, images } = product

    const price = default_price as Stripe.Price
    const colorOptions: ColorProps[] = metadata.colors ? JSON.parse(metadata.colors) : []
    const shippingTax = Number(metadata["shipping_tax"])

    const ref = useRef(null)
    const isInVIew = useInView(ref, { once: true })
    const useProductCardAnimation = useAnimation()

    useEffect(() => {
        if (!isInVIew) return
        useProductCardAnimation.start('visible')

    }, [isInVIew, useProductCardAnimation])

    return (
        <motion.div className="relative h-fit" ref={ref} variants={variants} initial={'hidden'} animate={useProductCardAnimation}>
            <Link href={`/products/${id}`} className="w-full overflow-hidden" prefetch={true}>
                <div className="bg-muted/40 rounded-[30px] min-h-[160px] relative">
                    <Image src={images.length === 0 ? '/assets/icons/placeholder.png' : images[0]}
                        priority quality={100}
                        layout="fill"
                        alt="product image" className="m-auto" style={{ maxWidth: 150, objectFit: 'contain' }} />
                    <div className="flex flex-col gap-1 absolute left-3 bottom-3">
                        {colorOptions.length > 1 &&
                            <ul className="flex gap-1 justify-start rounded-full p-1 bg-neutral-800/80 backdrop-blur-sm w-fit">
                                {colorOptions.map(({ name, code }) => (
                                    <li key={name} style={{ background: code }} className={`rounded-full border border-zinc-500 h-3 w-3 shadow-inner shadow-black/50`}></li>
                                ))}
                            </ul>
                        }
                    </div>

                </div>
                <div className="grid pl-3">
                    <header className="font-semibold py-2">
                        <p className="line-clamp-2">{name}</p>
                    </header>
                    <span className="text-sm">{price.unit_amount && (price.unit_amount / 100)?.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'EUR'
                    })}</span>
                </div>
            </Link>
        </motion.div>
    )
}