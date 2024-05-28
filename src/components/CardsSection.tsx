'use client'

import { motion, stagger, useAnimate } from "framer-motion";
import Image from "next/image";
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
            <motion.li initial={{ opacity: 0, x: -20 }} style={{ gridRow: '1/3' }} className="bg-accent shadow-md rounded-[30px] relative grid p-8 min-h-[250px] w-full min-[900px]:row overflow-hidden">
                <img alt="card-iphone" src='/assets/products/iphoneCard.png' className="h-full min-[900px]:h-[85%] drop-shadow-xl absolute right-0 min-[900px]:-right-10 self-center pt-3 bottom-0 max-[400px]:h-[82%] " />
                <header className="text-3xl">
                    <h1>iPhone</h1>
                    <p className="text-sm w-[65%] min-[900px]:w-[55%] text-balance mt-12 opacity-70">{"Noi di Fast Informatica abbiamo diversi modelli di iPhone disponibili con il migliore prezzo sul mercato. Spedizione in tutt'italia"}</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="products/category/iphones" className="card-link flex gap-3 items-center relative">
                        Tutti gli iPhone
                        <img src='/assets/icons/arrow-right.svg' className="w-8" />
                        <span className="absolute h-px bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent shadow-md rounded-[30px] relative grid p-8 h-[250px]  w-full overflow-hidden">
                <img src='/assets/products/airpodsCard.png' className="h-[90%] self-center absolute -right-12 filter" />
                <header className="text-3xl">
                    <h1>Airpods</h1>
                    <p className="text-sm w-[65%] min-[900px]:w-[50%] text-balance mt-6 opacity-70">Abbiamo Airpods e altre marche di cuffie con il migliore Prezzo.</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="/products/category/airpods" className="card-link flex gap-3 items-center relative">
                        Tutti prodotti
                        <img src='/assets/icons/arrow-right.svg' className="w-8" />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent shadow-md rounded-[30px] relative grid p-8 h-[250px]  w-full overflow-hidden">
                <img src='assets/products/notebook.png' className="h-[65%] object-contain absolute -right-20 self-center" />
                <header className="text-3xl">
                    <h1>Notebook</h1>
                    <p className="text-sm w-[70%] min-[900px]:w-[50%] text-balance mt-6 opacity-70">Notebook Disponiamo del miglor prezzo di notebook di diversi modelli, e altri prodotti informatici.</p>
                </header>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="products/category/notebooks" className="card-link flex gap-3 items-center relative">
                        Tutti prodotti
                        <Image src='/assets/icons/arrow-right.svg' alt="icon" width={32} height={32} />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>
        </section>
    )
}