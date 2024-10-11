"use client"

export type IconProps = React.HTMLAttributes<SVGElement>;
import { Dock, DockIcon } from '@/components/ui/dock';
import { House, Package, ShoppingCart, Users } from '@phosphor-icons/react';
import Link from 'next/link';
import { ReactNode } from 'react';

const tabs: { path: string, icon: ReactNode, title: string }[] = [
    { title: "Dashboard", path: "/dashboard", icon: <House className="h-5 w-5" /> },
    { title: "Pedidos", path: "/dashboard/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Produtos", path: "/dashboard/products", icon: <Package className="h-5 w-5" /> },
    { title: "Usuários", path: "/dashboard/customers", icon: <Users className="h-5 w-5" /> },
    // { title: "Analytics", path: "/dashboard/anaytics", icon: <ChartLine className="h-5 w-5" /> }
]

export function DashboardDock() {
    return (
        <div className='fixed left-0 bottom-6 w-full'>
            <Dock magnification={60} distance={100}>
                {tabs.map(({ icon, path, title }) => (
                    <DockIcon key={title} className="bg-black/10 dark:bg-white/10 p-3">
                        <Link href={path}>
                            {icon}
                        </Link>
                    </DockIcon>
                ))}
            </Dock>
        </div>
    )
}