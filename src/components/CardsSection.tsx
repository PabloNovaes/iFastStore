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
            <motion.li initial={{ opacity: 0, x: -20 }} className="bg-accent flex flex-col justify-between shadow-md rounded-[30px] relative p-8 min-h-[250px] w-full min-[900px]:row overflow-hidden">
                <img alt="iphone banner" src='/assets/products/iphoneCard.png' className="h-full min-[900px]:h-[85%] drop-shadow-xl absolute right-0 min-[900px]:-right-5 self-center pt-3 bottom-0 max-[400px]:h-[82%] " />
                <header className="text-3xl">
                    <h1>iPhone</h1>
                </header>
                <p className="text-sm w-[65%] min-[900px]:w-[55%] text-balance opacity-70">{"Noi di Fast Informatica abbiamo diversi modelli di iPhone disponibili con il migliore prezzo sul mercato. Spedizione in tutt'italia"}</p>
                <footer className="text-sm mt flex items-end w-fit z-[2]">
                    <Link href="products/category/iphone" className="flex gap-3 underline items-center relative">
                        Tutti gli iPhone
                        <Image src='/assets/icons/arrow-right.svg' alt="arrow right icon" width={32} height={32} />
                        <span className="absolute h-px bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent flex flex-col justify-between shadow-md rounded-[30px] relative p-8 h-[250px]  w-full overflow-hidden">
                <img alt="airpod banner" src='/assets/products/headphone.png' className="h-[85%] top-[-0%] absolute -right-6" />
                <header className="text-3xl">
                    <h1>Cuffie</h1>
                </header>
                <p className="text-sm w-[65%] min-[900px]:w-[50%] text-balance opacity-70">Abbiamo Airpods e altre marche di cuffie con il migliore Prezzo.</p>
                <footer className="text-sm  flex items-end w-fit z-[2]">
                    <Link href="/products/category/headphone" className="flex gap-3 underline items-center relative">
                        Tutti Cuffie
                        <Image src='/assets/icons/arrow-right.svg' alt="arrow right icon" width={32} height={32} />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>

            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent flex flex-col justify-between shadow-md rounded-[30px] relative p-8 h-[250px]  w-full overflow-hidden">
                <img alt="notebook banner" src='assets/products/notebook.png' className="h-[65%] object-contain absolute -right-20 self-center" />
                <header className="text-3xl">
                    <h1>Notebook</h1>
                </header>
                <p className="text-sm w-[70%] min-[900px]:w-[50%] text-balance opacity-70">Notebook Disponiamo del miglor prezzo di notebook di diversi modelli, e altri prodotti informatici.</p>
                <footer className="text-sm  flex items-end w-fit z-[2]">
                    <Link href="products/category/notebooks" className="flex gap-3 underline items-center relative">
                        Tutti prodotti
                        <Image src='/assets/icons/arrow-right.svg' alt="arrow right icon" width={32} height={32} />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </Link>
                </footer>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -40 }} className="bg-accent flex flex-col justify-between shadow-md rounded-[30px] relative p-8 h-[250px]  w-full overflow-hidden">
                <img alt="notebook banner" src='assets/products/gadget.png' className="h-[65%] object-contain absolute -right-14 mt-8 self-center" />
                <header className="text-3xl">
                    <h1>Software & acessori</h1>
                </header>
                <p className="text-sm w-[70%] min-[900px]:w-[50%] text-balance opacity-70">Notebook Disponiamo del miglor prezzo di notebook di diversi modelli, e altri prodotti informatici.</p>
                <footer className="text-sm  flex items-end w-fit z-[2]">
                    <span className="flex gap-3 items-center relative">
                        <p className="flex gap-1">
                            Tutti 
                            <Link href="products/category/software" className="underline">Software</Link>
                            &
                            <Link href="products/category/accessories" className="underline">Acessori</Link>
                        </p>
                        <Image src='/assets/icons/arrow-right.svg' alt="arrow right icon" width={32} height={32} />
                        <span className="absolute h-[1.5px] bg-primary w-0 opacity-0 -bottom-2 transition-all duration-300 "></span>
                    </span>
                </footer>
            </motion.li>
        </section>
    )
}