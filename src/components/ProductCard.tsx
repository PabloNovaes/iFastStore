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

    const ref = useRef(null)
    const isInVIew = useInView(ref, { once: true })
    const useProductCardAnimation = useAnimation()

    useEffect(() => {
        if (!isInVIew) return
        useProductCardAnimation.start('visible')

    }, [isInVIew, useProductCardAnimation])

    return (
        <motion.div ref={ref} variants={variants} initial={'hidden'} animate={useProductCardAnimation}>
            <Link href={`/products/${id}`} className="w-full overflow-hidden" prefetch={true}>
                <div className="bg-accent rounded-[30px] min-h-[160px] relative">
                    <Image src={images[0]}
                        priority quality={100}
                        layout="fill"
                        alt="product image" className="py-2 m-auto" style={{ maxWidth: 150, objectFit: 'contain' }} />
                </div>
                <div className="grid pl-3">
                    <header className="font-semibold py-2">
                        <ul className="flex gap-1 w-full justify-start py-3">
                            {metadata.colors && colorOptions.map(({ name, code }) => (
                                <li key={name} style={{ background: code }} className={`rounded-full h-3 w-3 shadow-inner shadow-black/50`}></li>
                            ))}
                        </ul>
                        <p>{name}</p>
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