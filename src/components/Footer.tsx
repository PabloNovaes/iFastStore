'use client'

import { Copyright, InstagramLogo, Phone } from "@phosphor-icons/react"

export function Footer() {
    return (
        <footer className="border-t flex justify-between items center p-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Copyright /> 2024 | iFast Store</p>
            <ul className="flex items-center gap-3">
                <a className="flex gap-2 items-center p-3 rounded-full bg-accent border" href="https://www.instagram.com/fastriparazionepc" target="_blank">
                    <InstagramLogo weight="fill" size={18} />
                </a>
                <a className="flex gap-2 items-center p-3 rounded-full bg-accent border" href="tel:+393891811897">
                    <Phone weight="fill" size={18} />
                </a>
            </ul>
        </footer>
    )
}