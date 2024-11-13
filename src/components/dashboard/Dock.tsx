"use client"

export type IconProps = React.HTMLAttributes<SVGElement>;
import { Dock, DockIcon } from '@/components/ui/dock';
import { House, Package, ShoppingCart, Storefront } from '@phosphor-icons/react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/react-separator';
import { useAnimate } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

const tabs: { path: string, icon: ReactNode, title: string }[] = [
    { title: "Dashboard", path: "/dashboard", icon: <House className="h-5 w-5" /> },
    { title: "Pedidos", path: "/dashboard/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Produtos", path: "/dashboard/products", icon: <Package className="h-5 w-5" /> },
    // { title: "Usuários", path: "/dashboard/customers", icon: <Users className="h-5 w-5" /> },
    // { title: "Analytics", path: "/dashboard/anaytics", icon: <ChartLine className="h-5 w-5" /> }
]

const useTooltipAnimations = (hover: boolean) => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        animate(
            "span",
            hover
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 },
            {
                type: "spring",
                bounce: 0,
                duration: 1.2
            }
        );

    }, [animate, hover])
    return scope
}

export function DashboardDock() {
    const [isHover, setIsHover] = useState(false)
    const { setTheme, theme } = useTheme()

    const scope = useTooltipAnimations(isHover)
    return (
        <div className='fixed left-0 bottom-6 w-full z-30 h-fit mt-[500px]'>
            <Dock ref={scope} magnification={50} distance={100} direction='middle' >
                {tabs.map(({ icon, path, title }) => (
                    <DockIcon link={path} tooltip={title} key={title} className="relative bg-black/10 dark:bg-white/10">
                        {icon}
                    </DockIcon>
                ))}
                <Separator orientation='vertical' className='w-px h-full bg-primary/10 mx-2' />
                <DockIcon
                    className='bg-black/10 dark:bg-white/10'
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    tooltip='Mudar tema'>
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-500" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-500" />
                </DockIcon>
                <DockIcon link='/' tooltip='Ir para loja' className="relative bg-black/10 dark:bg-white/10">
                    <Storefront className="h-5 w-5" />
                </DockIcon>
            </Dock>
        </div>
    )
}