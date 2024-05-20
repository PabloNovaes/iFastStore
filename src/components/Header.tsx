'use client'

import { motion, stagger, useAnimate } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { SignInButton, SignedOut } from '@clerk/nextjs';
import { ArrowLeft, Lightning, MagnifyingGlass, ShoppingCart as ShoppingCartIcon, X } from "@phosphor-icons/react";

import Image from "next/image";
import Link from "next/link";

import { Button } from './ui/button';


function useInputAnimation(searchIsOpen: boolean, isMenuOpen: boolean) {
    const [scope, animate] = useAnimate();
    const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

    useEffect(() => {

        animate(
            "div#mobile-menu",
            isMenuOpen
                ? { height: "100vh", opacity: 1, zIndex: 10 }
                : { height: 0 }
            ,
            {
                type: "spring",
                bounce: 0,
                duration: 0.5,
            }
        );

        animate(
            "span.animate-span",
            isMenuOpen
                ? { opacity: 1, filter: "blur(0px)", y: 0 }
                : { opacity: 0, filter: "blur(20px)", y: 100 },
            {
                duration: 0.6,
                delay: isMenuOpen ? staggerMenuItems : 0,
                type: "spring",
                bounce: 0,
            }
        );

        animate(
            "button#x",
            isMenuOpen
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
            {
                duration: 0.2,
                delay: isMenuOpen ? staggerMenuItems : 0,
            }
        );
    }, [isMenuOpen, animate, staggerMenuItems]);

    useEffect(() => {
        animate(
            "form",
            searchIsOpen
                ? { opacity: 1, width: "100%", borderBottom: '1px solid rgb(203 213 225)' }
                : { opacity: 0, width: 0 },
            {
                type: "spring",
                bounce: 0,
                duration: 0.5,
            }
        );
    }, [searchIsOpen, animate]);

    return scope;
}

export function Header({ isAdmin }: { isAdmin: boolean }) {
    const [searchIsOpen, setSearchIsOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const scope = useInputAnimation(searchIsOpen, isMenuOpen)
    const inputRef = useRef(null);

    useEffect(() => {
        if (isMenuOpen) {
            window.document.body.classList.add("overflow-hidden")
        }
        if (!isMenuOpen) {
            window.document.body.classList.remove("overflow-hidden")
        }

        if (searchIsOpen && inputRef.current) {
            const input = inputRef.current as HTMLInputElement;
            input.focus();
        }
    }, [searchIsOpen, isMenuOpen]);

    const { back, push } = useRouter()
    const pathname = usePathname()


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        if (!inputRef.current) return

        const input = inputRef.current as HTMLInputElement

        if (input.value.trim() === '') return

        input.blur()
        push(`/products?name=${input.value}`)
    }

    return (
        <div className="w-full z-20">
            <header className="flex text-primary bg-white border-b relative h-[50px]" ref={scope}>
                <div className="flex items-center w-full max-w-5xl m-auto justify-between h-[50px]">
                    <h1 className="max-[1050px]:ml-4 min-[500px]:w-full flex">
                        {
                            pathname !== '/'
                                ? <button onClick={back} className="grid place-content-center rounded-lg p-2 h-fit w-fit rouned-md hover:bg-accent transition-all duration-300">
                                    <ArrowLeft size={18} />
                                </button>
                                : <Lightning weight="fill" size={22} />
                        }
                    </h1>
                    <nav className="flex items-center gap-8 font-light text-sm max-[500px]:hidden">
                        <Link href={'/'}>Casa</Link>
                        <Link href={'/products'}>Prodotti</Link>
                        <Link href={'/account'}>Account</Link>
                        {isAdmin && <Link href={'/dashboard'}>Dashboard</Link>}
                    </nav>
                    <div className="flex items-center gap-2 p-3 px-5 w-full justify-end">
                        <motion.form className="w-0" onSubmit={handleSubmit}>
                            <input onBlur={() => setSearchIsOpen(false)} type="text" ref={inputRef}
                                placeholder="Search.." className="bg-transparent w-full focus:outline-none font-light" />
                        </motion.form>
                        <button onClick={() => setSearchIsOpen(true)} className=" rounded-lg p-2 hover:bg-accent transition-all duration-300">
                            <MagnifyingGlass size={18} />
                        </button>
                        <button onClick={() => push('/cart')} className="rounded-lg p-2 hover:bg-accent transition-all duration-300">
                            <ShoppingCartIcon size={18} />
                        </button>
                        <SignedOut>
                            <span className="hidden min-[500px]:flex overflow-hidden">
                                <SignInButton mode='modal'>
                                    <Button className='py-1 rounded-l text-primary' variant={'outline'}>Sign in</Button>
                                </SignInButton>
                            </span>
                        </SignedOut>
                        <button onClick={() => setIsMenuOpen(true)} className=" rounded-lg p-2 hover:bg-accent transition-all duration-300 min-[500px]:hidden">
                            <Image src="/assets/icons/menu.svg" alt="menu icon" height={18} width={18} style={{ maxWidth: "none" }} />
                        </button>

                    </div>
                </div>

                <motion.div id="mobile-menu" className="menu w-full bg-white absolute -z-10 left-0 top-0 h-0 opacity-0">
                    <nav style={{ height: "calc(100% - 50px)" }} className="flex-col flex justify-center items-center h-nav gap-5 font-light text-4xl relative text-primary min-[500px]:overflow-hidden">
                        <motion.button id="x" className="absolute right-7 top-8" onClick={() => setIsMenuOpen(false)}>
                            <X size={18} />
                        </motion.button>
                        <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                            <Link href={'/'}>Casa</Link>
                        </motion.span>
                        <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                            <Link href={'/account'}>Account</Link>
                        </motion.span>
                        <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                            <Link href={'/products'}>Prodotti</Link>
                        </motion.span>
                        {isAdmin && <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                            <Link href={'/dashboard'}>Dashboard</Link>
                        </motion.span>}
                        <SignedOut>
                            <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                                <SignInButton mode='modal'>
                                    <Button className='py-1 rounded-l w-full'>Sign in</Button>
                                </SignInButton>
                            </motion.span>
                        </SignedOut>
                    </nav>
                </motion.div>
            </header >
        </div >
    )
}