'use client'

import { motion, stagger, useAnimate } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { SignInButton, SignedOut } from '@clerk/nextjs';
import { ArrowLeft, Lightning, MagnifyingGlass, ShoppingCart as ShoppingCartIcon } from "@phosphor-icons/react";

import Link from "next/link";

import { NavbarLinks } from "./NavbarLinks";
import { ToggleTheme } from "./toogle-theme";
import { Button } from './ui/button';


function useInputAnimation(searchIsOpen: boolean, isMenuOpen: boolean) {
    const [scope, animate] = useAnimate();
    const staggerMenuItems = stagger(0.1, { startDelay: .15 });

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
                : { opacity: 0, filter: "blur(10px)", y: -50 },
            {
                duration: 0.6,
                delay: isMenuOpen ? staggerMenuItems : 0,
                type: "spring",
                bounce: 0,
            }
        );
    }, [isMenuOpen, animate, staggerMenuItems]);

    useEffect(() => {
        animate(
            "form",
            searchIsOpen
                ? { opacity: 1, width: "50%", borderBottom: '1px solid rgb(203 213 225)' }
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

        const query = input.value
        input.value = ""
        input.blur()
        push(`/products?name=${query.toLowerCase()}`)
    }

    return (
        <div className="w-full z-20">
            <header className="flex text-primary bg-background border-b relative h-[50px]" ref={scope}>
                <div className="flex items-center w-full max-w-5xl m-auto justify-between h-[50px]">
                    <h1 className="max-[1050px]:ml-4 min-[500px]:w-full flex">
                        {
                            pathname !== '/'
                                ? <button onClick={back} className="grid place-content-center rounded-lg p-2 h-fit w-fit rouned-md hover:bg-muted/40 transition-all duration-300">
                                    <ArrowLeft size={18} />
                                </button>
                                : <Lightning weight="fill" size={22} />
                        }
                    </h1>
                    <nav className="flex items-center gap-2 font-light text-sm max-md:hidden">
                        <NavbarLinks currentPath={pathname} isAdmin={isAdmin} />
                    </nav>
                    <div className="flex items-center gap-2 p-3 px-5 w-full justify-end">
                        <motion.form className="w-0" onSubmit={handleSubmit}>
                            <input onBlur={() => setSearchIsOpen(false)} type="text" ref={inputRef}
                                placeholder="Search.." className="bg-transparent w-full focus:outline-none font-light" />
                        </motion.form>
                        <button onClick={() => setSearchIsOpen(true)} className=" rounded-lg p-2 hover:bg-muted/40 transition-all duration-300">
                            <MagnifyingGlass size={18} />
                        </button>
                        <button onClick={() => push('/cart')} className="rounded-lg p-2 hover:bg-muted/40 transition-all duration-300">
                            <ShoppingCartIcon size={18} />
                        </button>
                        <div className="max-[500px]:hidden">
                            {
                                pathname !== "/account" && (
                                    <SignedOut>
                                        <span onClick={() => setIsMenuOpen(false)}>
                                            <SignInButton mode='modal'>
                                                <Button className='py-1 rounded-xl bg-muted/40 hover:bg-muted text-primary border w-full'>Login</Button>
                                            </SignInButton>
                                        </span>
                                    </SignedOut>
                                )
                            }
                        </div>
                        <button
                            className="relative w-8 h-8 z-20 focus:outline-none md:hidden justify-center items-center"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                        >
                            <motion.span
                                className="block rounded-xl opacity-80 absolute h-px w-[18px] bg-primary"
                                style={{ y: "-3px" }}
                                animate={{
                                    y: isMenuOpen ? 0 : "-3px",
                                    rotate: isMenuOpen ? 45 : 0
                                }}
                                transition={{ duration: 0.3, ease: "backInOut" }}
                            />
                            <motion.span
                                className="block rounded-xl opacity-80 absolute h-px w-[18px] bg-primary"
                                style={{ y: "3px" }}
                                animate={{
                                    y: isMenuOpen ? 0 : "3px",
                                    rotate: isMenuOpen ? -45 : 0
                                }}
                                transition={{ duration: 0.3, ease: "backInOut" }}
                            />
                        </button>
                        <ToggleTheme className="rounded-xl p-2 border hover:bg-muted bg-muted/40 " />
                    </div>
                </div>

                <motion.div id="mobile-menu" className="menu w-full bg-background absolute -z-10 left-0 top-0 h-0 opacity-0">
                    <nav style={{ height: "calc(100% - 50px)" }} className="flex-col flex justify-center items-center h-nav gap-10 font-light text-4xl relative text-primary min-[500px]:overflow-hidden">
                        <motion.span className="animate-span" onClick={() => setIsMenuOpen(false)}>
                            <Link href={'/'}>Home</Link>
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
                                    <Button className='py-1 rounded-l w-full'>Login</Button>
                                </SignInButton>
                            </motion.span>
                        </SignedOut>
                    </nav>
                </motion.div>
            </header >
        </div >
    )
}