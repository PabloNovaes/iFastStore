"use client"

import { Copyright, Envelope, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-primary-foreground">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="text-lg font-regular flex flex-col items-center sm:items-start gap-2">
                            <Image
                                src="/assets/icons/fast-store-icon.svg"
                                width={40}
                                height={40}
                                alt="iFast Store logo"
                                className="invert rounded"
                            />
                            <h2 className="font-bold">iFast Store</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Vendita di iPhone, Notebook e accessori <br /> in tutta Italia.
                        </p>
                    </div>
                    <div className="space-y-3 flex flex-col">
                        <h2 className="text-lg font-semibold">Contatti</h2>
                        <ul className="flex justify-center sm:justify-start space-x-2 text-sm">
                            <li>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    className="w-10 h-10 rounded-full bg-accent hover:bg-[#46c254] hover:text-white transition-all duration-300"
                                >
                                    <Link
                                        href="https://wa.me/393338343528"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Contattaci su WhatsApp"
                                    >
                                        <WhatsappLogo weight="duotone" size={24} />
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    className="w-10 h-10 rounded-full bg-accent hover:bg-gradient-to-b from-[#833ab4] via-[#fd1d1d]/90 to-[#fcb045] hover:text-white transition-all duration-300"
                                >
                                    <Link
                                        href="https://www.instagram.com/ifaststore_fastriparazione/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Seguici su Instagram"
                                    >
                                        <InstagramLogo weight="duotone" size={24} />
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    className="w-10 h-10 rounded-full bg-accent hover:bg-[#e34134] hover:text-white transition-all duration-300"
                                >
                                    <Link
                                        href="mailto:info@ifaststore.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Inviaci una email"
                                    >
                                        <Envelope weight="duotone" size={24} />
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
                        <Copyright size={16} />
                        <span>{currentYear} iFast Store</span>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2 text-center w-full sm:w-auto">
                        <span>P.IVA: 11610820968</span>
                        <span className="hidden sm:inline">|</span>
                        <span>DE AGUIAR INVEST</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}