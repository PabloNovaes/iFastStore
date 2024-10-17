"use client"

export type IconProps = React.HTMLAttributes<SVGElement>;
import { Dock, DockIcon } from '@/components/ui/dock';
import { House, Package, ShoppingCart, Users } from '@phosphor-icons/react';
import { Separator } from '@radix-ui/react-separator';
import { useAnimate } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { ToggleTheme } from '../toogle-theme';

const tabs: { path: string, icon: ReactNode, title: string }[] = [
    { title: "Dashboard", path: "/dashboard", icon: <House className="h-5 w-5" /> },
    { title: "Pedidos", path: "/dashboard/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Produtos", path: "/dashboard/products", icon: <Package className="h-5 w-5" /> },
    { title: "Usuários", path: "/dashboard/customers", icon: <Users className="h-5 w-5" /> },
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

    const scope = useTooltipAnimations(isHover)
    return (
        <div className='fixed left-0 bottom-6 w-full z-30 h-fit mt-[500px]'>
            <Dock ref={scope} magnification={60} distance={100} direction='bottom' >
                {tabs.map(({ icon, path, title }) => (
                    <DockIcon link={path} tooltip={title} key={title} className="relative bg-black/10 dark:bg-white/10">
                        {icon}
                    </DockIcon>
                ))}
                <Separator orientation='vertical' className='w-px h-full bg-primary/10 mx-2' />
                <DockIcon tooltip='Mudar tema'>
                    <ToggleTheme className='bg-black/10 dark:bg-white/10 size-10 border-0 rounded-full' />
                </DockIcon>
            </Dock>
        </div>
    )
}