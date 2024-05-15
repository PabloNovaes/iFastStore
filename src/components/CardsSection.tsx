'use client'

import { motion, stagger, useAnimate } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";


const useCardsAnimation = () => {
    const [scope, animate] = useAnimate();
    const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

    useEffect(() => {
        animate(
            "li", {
            opacity: 1,
            x: 0

        },
            {
                delay: staggerMenuItems,
                type: "spring",
                bounce: 0,
                duration: 1.2
            }
        );

    }, [animate, staggerMenuItems])
    return scope
}

export function CardsSection() {
    const scope = useCardsAnimation()

    return (
        <section ref={scope} className="grid gap-5 grid-cols-2 justify-items-center max-[900px]:grid-cols-1">
            <motion.li initial={{ opacity: 0, x: -20 }} style={{gridRow: '1/3'}} className="bg-accent shadow-md rounded-[30px] relative grid p-8 min-h-[250px] w-full min-[900px]:row overflow-hidden">
                <img alt="card-iphone" src='/assets/products/iphoneCard.png' className="h-full drop-shadow-xl absolute right-0 min-[900px]:-right-10 self-center pt-3" />
                <header className="text-3xl">
                    <h1>iPhones</h1>
                    <p className="text-sm mt-12 opacity-70">Tecnologia all avanguardia <br /> in un design elegante. <br /> Scopri i nostri iPhone.</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="products/category/iphones" className="card-link flex gap-3 items-center relative">
                        Esplore categoria
                        <img src='/assets/icons/arrow-right.svg' className="w-8" />
                        <span className="absolute h-px bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent shadow-md rounded-[30px] relative grid p-8 h-[250px]  w-full overflow-hidden">
                <img src='/assets/products/airpodsCard.png' className="h-[90%] self-center absolute -right-12 filter" />
                <header className="text-3xl">
                    <h1>Airpods</h1>
                    <p className="text-sm mt-6 opacity-70">Musica ovunque tu vada, <br /> senza limiti. Scopri <br /> i nostri AirPod.</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="/products/category/airpods" className="card-link flex gap-3 items-center relative">
                        Esplore categoria
                        <img src='/assets/icons/arrow-right.svg' className="w-8" />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent shadow-md rounded-[30px] relative grid p-8 h-[250px]  w-full overflow-hidden">
                <img src='assets/products/notebook.png' className="h-[65%] object-contain absolute -right-20 self-center" />
                <header className="text-3xl">
                    <h1>Notebooks</h1>
                    <p className="text-sm mt-6 opacity-70">Mobilità e prestazioni in <br /> un unico dispositivo. <br /> Scopri i nostri notebooks.</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="products/category/notebooks" className="card-link flex gap-3 items-center relative">
                        Esplore categoria
                        <img src='/assets/icons/arrow-right.svg' className="w-8" />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>
        </section>
    )
}