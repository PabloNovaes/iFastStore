'use client'

import { Copyright, InstagramLogo, Phone } from "@phosphor-icons/react"

export function Footer() {
    return (
        <footer className="border-t flex justify-between items center p-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
                <Copyright />
                2024
                <span>|</span>
                <span>iFast Store</span>
                <span>|</span>
                <span>P.IVA:11610820968 - DE AGUIAR INVEST</span>
            </div>
            <ul className="flex items-center gap-3">
                <a className="flex gap-2 items-center p-3 rounded-full bg-accent border" href="https://www.instagram.com/fastriparazionepc" target="_blank">
                    <InstagramLogo weight="fill" size={18} />
                </a>
                <a className="flex gap-2 items-center p-3 rounded-full bg-accent border" href="tel:+39 3338343528">
                    <Phone weight="fill" size={18} />
                </a>
            </ul>
        </footer>
    )
}