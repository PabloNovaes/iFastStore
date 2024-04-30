'use client'

import { CreateAdressSchema, CreteAdressForm } from "@/components/CreateAdressForm";
import { OrderProductCard } from "@/components/OrderProducts";
import { UpdateAdressForm } from "@/components/UpdateAdressForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton, useUser } from "@clerk/nextjs";
import { Cardholder, ListChecks, Package, PencilSimple, Plus, SmileySad, Truck } from "@phosphor-icons/react";
import { Order, Products_per_order } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import Stripe from "stripe";
import { AdressProps } from "../api/adresses/route";

interface TabsProps {
    name: ReactNode
    icon: ReactNode
    status: string
}

export interface ProductsPerOrderProps extends Products_per_order {
    price: Stripe.Price
}

export interface OrdersProps extends Order {
    products: ProductsPerOrderProps[]

}

const tabs: TabsProps[] = [
    {
        name: <p className="sm:text-xs text-[11px] font-normal">attesa<br />pagamento</p>,
        icon: <Cardholder size={18} />
        ,
        status: "awaiting_payment"
    },
    {
        name: <p className="sm:text-xs text-[11px] font-normal">preparazione <br />{"dell'ordine"} </p>,
        icon: <Package size={18} />
        ,
        status: "awaiting_send"
    },
    {
        name: <p className="sm:text-xs text-[11px] font-normal">order < br /> spedito</p>,
        icon: <Truck size={18} />
        ,
        status: "order_dispatched"
    },
    {
        name: <p className="sm:text-xs text-[11px] font-normal">richiesta <br /> ricevuta</p>,
        icon: <ListChecks size={18} />
        ,
        status: "order_received"
    },
]

export default function Account() {
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [adress, setAdress] = useState<AdressProps[]>([])
    const [orders, setOrders] = useState<OrdersProps[]>([])

    useEffect(() => {
        const fecthAccountData = async () => {
            try {
                if (!user) return
                setIsLoading(true)

                const [adress, orders] = await Promise.all([
                    fetch(`/api/adresses?userId=${user.id}`),
                    fetch(`/api/order?userId=${user.id}`)
                ])

                const adressData = await adress.json()
                const ordersData = await orders.json()

                setAdress(adressData)
                setOrders(ordersData)
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }

        fecthAccountData()
    }, [user, setIsLoading])


    const handleSubmit = async (data: CreateAdressSchema) => {
        if (!user) return

        const { name, cap, ...rest } = data
        const response = await fetch(`/api/adresses/${user.id}`, {
            method: 'POST',
            body: JSON.stringify({ ...rest, userId: user ? user.id : "" as string, name, cap: Number(cap) })
        })

        const newAdress = await response.json()
        setAdress([newAdress])
    }

    const updateAdress = async (data: CreateAdressSchema): Promise<void> => {
        try {
            if (!user) return

            const { cap, ...rest } = data
            const response = await fetch(`/api/adresses/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...rest, cap: Number(cap), id: adress[0].id })
            })

            const newAdress = await response.json()
            setAdress([newAdress])
        } catch (error) {
            console.log(error)
        }
    }

    if (!isLoaded) return


    return (
        <main className="p-5 flex flex-col gap-6 max-w-5xl m-auto " style={{ minHeight: 'calc(100dvh - 50px)' }}>
            {!user &&
                <div className="flex items-center opacity-80 justify-center gap-4 flex-col" style={{ minHeight: 'calc(100svh - 80px)' }}>
                    <SmileySad size={60} />
                    <p className="font-medium text-2xl text-center">Oops...sembra che tu non sia autenticato</p>
                </div>
            }


            {user &&
                <>
                    <div className="flex items-center gap-3">
                        <UserButton userProfileMode="modal" appearance={{ elements: { avatarBox: { width: '4rem', height: '4rem' } } }} />
                        <span>
                            <p className="max-sm:text-xs text-sm font-semibold">{user?.fullName}</p>
                            <p className="max-sm:text-xs text-sm ">{user?.primaryEmailAddress?.emailAddress}</p>
                        </span>
                    </div>

                    <Separator className="w-full" />
                    <h2 className="font-semibold text-lg">Ordine</h2>
                    <div className="flex gap-6 max-[500px]:flex-col h-full">
                        <Tabs defaultValue="awaiting_payment" className="flex-[2] min-w-[380px] h-fit">
                            <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl">
                                {tabs.map(({ icon, name, status }) => (
                                    <TabsTrigger className="flex-col rounded-lg" key={status} value={status}>
                                        {icon}
                                        {name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {tabs.map(({ status }) => {
                                if (orders.length === 0) return (
                                    <TabsContent key={status} value={status} className="max-h-[334px] overflow-auto gap-2 text-center p-1 h-fit text border rounded-lg">
                                        Nessun ordine ancora
                                    </TabsContent>
                                )
                                const filtered = orders.filter(x => x.status.toLowerCase() === status)
                                return filtered.length === 0

                                    ?
                                    (<TabsContent key={status} value={status} className="max-h-[334px] overflow-auto gap-2 text-center p-1 h-fit text border rounded-lg">
                                        Nessun ordine ancora
                                    </TabsContent>)
                                    :
                                    filtered.map((order) => {
                                        const { products, id, status } = order
                                        return (
                                            <TabsContent key={id} value={status} className="max-h-[334px] overflow-auto grid gap-2 h-fit">
                                                {products.map(() => (
                                                    <OrderProductCard {...order} key={status} />
                                                ))}
                                            </TabsContent>
                                        )
                                    })
                            })}
                        </Tabs>
                        <div className="rounded-xl min-[500px]:w-72 border gap-2 flex flex-col overflow-hidden h-fit p-3 text-sm">
                            {adress.length <= 0 &&
                                <header className="flex items-center justify-between w-full">
                                    {isLoading
                                        ? <div className="flex gap-3 w-full">
                                            <Skeleton className="w-full h-9" />
                                            <Skeleton className="w-full size-9" />
                                        </div>
                                        :
                                        <>
                                            <h2 className="font-semibold text-md">{"Registra i dettagli della consegna"}</h2>
                                            <CreteAdressForm onSubmit={handleSubmit} >
                                                <Button variant={"outline"} className="w-fit h-fit p-2 rounded-lg">
                                                    <Plus size={18} />
                                                </Button>
                                            </CreteAdressForm>
                                        </>

                                    }
                                </header>
                            }

                            {adress.length !== 0 &&
                                <>
                                    <header className="flex items-center justify-between w-full">
                                        <h2 className="font-semibold text-md">{"Dati di consegna"}</h2>
                                        <UpdateAdressForm currentData={adress[0]} onSubmit={updateAdress}>
                                            <Button variant={"outline"} className="w-fit h-fit p-2 rounded-lg">
                                                <PencilSimple size={18} />
                                            </Button>
                                        </UpdateAdressForm>
                                    </header>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-3" style={{ gridColumn: "1/4" }}>
                                            <div className="font-semibold">{"informazioni sull'indirizzo"}</div>
                                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                                <span>{adress[0].name}</span>
                                                <span>{adress[0].street}</span>
                                                <span>{`${adress[0].cap}, ${adress[0].city}`}</span>
                                                <span>{adress[0].complement}</span>
                                            </address>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="grid gap-3">
                                        <div className="font-semibold">Mie dati</div>
                                        <dl className="grid gap-3">
                                            <div className="flex items-center justify-between">
                                                <dt className="text-muted-foreground">Cliente</dt>
                                                <dd>{adress[0].name}</dd>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <dt className="text-muted-foreground">Email</dt>
                                                <dd>
                                                    <a href="mailto:">{adress[0].email}</a>
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <dt className="text-muted-foreground">Cellulare</dt>
                                                <dd>
                                                    <a href="tel:">{adress[0].cellphone}</a>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </>}
                        </div>

                    </div>
                </>
            }
        </main >
    )
}

