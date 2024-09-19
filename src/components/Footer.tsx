"use client"

import { Copyright, FacebookLogo, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t mt-10">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="text-lg font-regular inline-flex items-center gap-2 rounded-full bg-primary p-1.5 text-secondary">
                            <Image
                                src={"/assets/icons/fast-store-icon.svg"}
                                width={30}
                                height={30}
                                alt="logo"
                            />
                            <h2 className="mr-1">iFast Store</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Riparazioni veloci e affidabili per i tuoi dispositivi elettronici.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Contatti</h2>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="https://wa.me/393338343528" className="inline-flex items-center gap-2 hover:underline justify-center sm:justify-start">
                                    <WhatsappLogo weight="fill" color="#46c254" size={24} />
                                    +39 333 834 3528
                                </Link>
                            </li>
                            <li>
                                <Link href="mailto:info@ifaststore.com" className="hover:underline">
                                    info@ifaststore.com
                                </Link>
                            </li>
                            <li>Via Example, 123, 20100 Milano, Italy</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Servizi</h2>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="https://wa.me/393338343528?text=Salve, vorrei fare un preventivo" className="hover:underline">Riparazioni</Link></li>
                            {/* <li><Link href="https://wa.me/393338343528?text=Salve, vorrei fare un preventivo" className="hover:underline">Vendita Dispositivi</Link></li> */}
                            <li><Link href="https://wa.me/393338343528?text=Salve, vorrei fare un preventivo" className="hover:underline">Assistenza Tecnica</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Seguici</h2>
                        <div className="flex space-x-4 justify-center sm:justify-start">
                            <Link
                                href="https://www.instagram.com/fastriparazionepc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-gradient-to-b from-[#833ab4] via-[#fd1d1d]/90 to-[#fcb045] hover:text-white transition-all duration-300"
                                aria-label="Seguici su Instagram"
                            >
                                <InstagramLogo size={24} />
                            </Link>
                            <Link
                                href="https://www.facebook.com/ifaststore"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-[#0864f7] hover:text-white transition-all duration-300"
                                aria-label="Seguici su Facebook"
                            >
                                <FacebookLogo weight="fill" size={24} />
                            </Link>
                        </div>
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