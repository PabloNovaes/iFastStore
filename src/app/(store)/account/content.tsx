'use client'

import { CreateAdressSchema, CreteAdressForm } from "@/components/CreateAdressForm";
import { OrderProductCard } from "@/components/OrderProducts";
import { UpdateAdressForm } from "@/components/UpdateAdressForm";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton, useUser } from "@clerk/nextjs";
import { Cardholder, ListChecks, Package, PencilSimple, Plus, SmileySad, Truck } from "@phosphor-icons/react";
import { Order, Products_per_order } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import Stripe from "stripe";
import { AdressProps } from "../../api/adresses/route";


export interface ProductsPerOrderProps extends Products_per_order {
    price: Stripe.Price
}

export interface OrdersProps extends Order {
    products: ProductsPerOrderProps[]

}

interface TabsProps {
    name: ReactNode;
    icon: ReactNode;
    status: string;

}

const tabs: TabsProps[] = [
    {
        name: <p className="sm:text-xs text-[11px] font-normal">attesa<br />pagamento</p>,
        icon: <Cardholder size={18} />,
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
        status: "order_delivered"
    },
]

export function Account() {
    const [isLoading, setIsLoading] = useState(false);
    const [adress, setAdress] = useState<AdressProps[]>([])
    const [orders, setOrders] = useState<OrdersProps[]>([])

    const { user, isLoaded } = useUser();

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


    const handleConfirmDelivery = (orderId: string) => {
        return setOrders((state) => {
            const index = state.findIndex(order => order.id === orderId)
            const ordersArray = [...state]

            const { status, ...rest } = state[index]
            ordersArray[index] = {
                ...rest, status: "ORDER_DELIVERED"
            }

            return ordersArray
        })

    }

    if (!isLoaded) return

    return (
        <main className="p-5 flex flex-col gap-6 max-w-5xl m-auto " style={{ minHeight: 'calc(100dvh - 50px)' }}>
            {!user &&
                <div className="flex flex-1 items-center opacity-80 justify-center gap-4 flex-col">
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
                    <div className="flex gap-6 h-full flex-wrap">
                        <Tabs defaultValue="awaiting_payment" className="flex-[2] md:min-w-[416px] h-fit">
                            <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl">
                                {tabs.map(({ icon, name, status }) => {
                                    const filtered = orders.filter(order => order.status.toLowerCase() === status);

                                    return (
                                        <TabsTrigger className="tab-trigger flex-col rounded-lg relative" key={status} value={status}>
                                            {filtered.length !== 0 && <span key={Math.random()} className="size-5 transition-opacity absolute top-1 right-2 grid place-content-center text-xs md:text-sm rounded-full bg-primary  text-primary-foreground">{filtered.length}</span>}
                                            {icon}
                                            {name}
                                        </TabsTrigger>
                                    )
                                })}
                            </TabsList>
                            {tabs.map(({ status }) => {
                                const filtered = orders.filter(order => order.status.toLowerCase() === status);
                                if (filtered.length === 0) {
                                    return (
                                        <TabsContent key={status} value={status} className="max-h-[334px] overflow-auto gap-2 text-center p-1 h-fit text border rounded-lg">
                                            Nessun ordine ancora
                                        </TabsContent>
                                    );
                                }
                                return (
                                    <TabsContent key={status} value={status} className="grid gap-2 h-fit data-[state=inactive]:mt-0">
                                        {filtered.map((order) => (
                                            <Accordion type="single" defaultValue={filtered[0].id} key={order.id} collapsible className="border h-fit px-2 rounded-xl w-full bg-white">
                                                <OrderProductCard onConfirmDelivery={handleConfirmDelivery} {...order} />
                                            </Accordion>
                                        ))}
                                    </TabsContent>
                                );
                            })}

                        </Tabs>
                        <div className="rounded-xl md:max-w-72 border gap-2 w-full flex flex-col overflow-hidden h-fit p-3 text-sm">
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
