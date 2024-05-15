"use client"

import { OrdersProps } from "@/app/(admin)/dashboard/content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CircleNotch, CreditCard, PaypalLogo } from "@phosphor-icons/react";
import { ReactNode, useRef, useState } from "react";
import { CopyCode } from "../CopyCode";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../ui/card";

import {
    Drawer,
    DrawerContent,
    DrawerTrigger
} from "@/components/ui/drawer";

import { Input } from "../ui/input";

interface Props extends OrdersProps {
    onSaveShippingCode: (data: { code: string, id: string }) => Promise<void>;
    children?: ReactNode
    open?: boolean
    setOpen?: () => void;
}

export function OrderOverview({ id, created_at, products, total, adress, shipping_code, onSaveShippingCode, status, shipping_tax, payment_method }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef(null)

    return (

        <Card className="overflow-hidden max-lg:col-span-2 max-sm:hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Pedido
                        <span className="sr-only">Copy Order ID</span>
                    </CardTitle>
                    <CardDescription>{new Date(created_at).toLocaleString("pt", {
                        month: "long", day: "numeric", year: "numeric", second: "numeric", minute: "numeric", hour: "numeric"
                    })}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Detalhes do pedido</div>
                    <ul className="grid gap-3">
                        {products && products.map(({ id, name, quantity, price, color }) => (
                            <li key={id} className="flex items-center justify-between">
                                <span className="text-muted-foreground grid">
                                    <span>{`${name} - ${price.nickname} x ${quantity}`}</span>
                                    <span>cor: {color}</span>
                                </span>
                                <span>{price.unit_amount && (price.unit_amount / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                            </li>
                        ))}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Entrega</span>
                            <span>{(shipping_tax / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            {/* <span className="text-muted-foreground">Taxa</span>
                            <span>$25.00</span> */}
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>{(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-3 col-span-3">
                        <div className="font-semibold">Informações de entrega</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{adress.name}</span>
                            <span>{`${adress.cap}, ${adress.city}`}</span>
                            <span>{adress.street}</span>
                            <span>
                                {shipping_code === null && status === "AWAITING_SEND" &&
                                    (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full mt-2" variant={"outline"}>Inserir código de rastreio</Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-[70vw] rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Cadastrar código de rastreio</DialogTitle>
                                                    <DialogDescription className="text-sm">
                                                        Insira o código para que seu cliente consiga acompanhar o trajeto do pedido.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Input ref={inputRef} type="text" placeholder="Digite ou cole o código" className="my-4" />
                                                <DialogFooter>
                                                    <Button type="submit" className="w-fit self-end" disabled={isLoading} onClick={async () => {
                                                        if (inputRef.current === null) return
                                                        setIsLoading(true)

                                                        const code = (inputRef.current as HTMLInputElement).value
                                                        await onSaveShippingCode({ code, id })
                                                        setIsLoading(false)
                                                    }}>
                                                        {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Enviar"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog >

                                    )
                                }

                                {shipping_code !== null && <span>Rastreio: {shipping_code} <CopyCode code={String(shipping_code)} /></span>}
                            </span>
                        </address>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Informações do cliente</div>
                    < dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Cliente</dt>
                            <dd>{adress.name}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                                <a href="mailto:">{adress.email}</a>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Celular</dt>
                            <dd>
                                <a href="tel:">{adress.cellphone}</a>
                            </dd>
                        </div>
                    </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            {payment_method === "card" &&
                                <dt className="flex items-center gap-1 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    Cartão
                                </dt>
                            }
                            {payment_method === "paypal" &&
                                <dt className="flex items-center gap-1 text-muted-foreground">
                                    <PaypalLogo className="h-4 w-4" />
                                    Paypal
                                </dt>
                            }
                        </div>
                    </dl>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground gap-2 flex items-center">
                    {`ID: ${id}`} <CopyCode code={id} />
                </div>
            </CardFooter>
        </Card >
    )
}

export function MobileOrderOverview({ id, created_at, products, total, adress, shipping_code, onSaveShippingCode, status, shipping_tax, payment_method }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef(null)


    return (
        <Drawer>
            <DrawerTrigger className="w-[100%] h-full max-h-[55px] absolute top-0 left-0"></DrawerTrigger>
            <DrawerContent>
                <Card className="max-lg:col-span-2 max-h-[90svh] overflow-auto rounded-none border-none">
                    <CardHeader className="flex flex-row items-start">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Pedido
                                <span className="sr-only">Copy Order ID</span>
                            </CardTitle>
                            <CardDescription>{new Date(created_at).toLocaleString("pt", {
                                month: "long", day: "numeric", year: "numeric", second: "numeric", minute: "numeric", hour: "numeric"
                            })}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                            <div className="font-semibold">Detalhes do pedido</div>
                            <ul className="grid gap-3">
                                {products && products.map(({ id, name, quantity, price, color }) => (
                                    <li key={id} className="flex items-center justify-between">
                                        <span className="text-muted-foreground grid">
                                            <span>{`${name} - ${price.nickname} x ${quantity}`}</span>
                                            <span>cor: {color}</span>
                                        </span>
                                        <span>{price.unit_amount && (price.unit_amount / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                                    </li>
                                ))}
                            </ul>
                            <Separator className="my-2" />
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Entrega</span>
                                    <span>{(shipping_tax / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    {/* <span className="text-muted-foreground">Taxa</span>
                                    <span>$25.00</span> */}
                                </li>
                                <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">Total</span>
                                    <span>{(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>
                                </li>
                            </ul>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-3 col-span-3">
                                <div className="font-semibold">Informações de entrega</div>
                                <address className="grid gap-0.5 not-italic text-muted-foreground">
                                    <span>{adress.name}</span>
                                    <span>{`${adress.cap}, ${adress.city}`}</span>
                                    <span>{adress.street}</span>
                                    <span>
                                        {shipping_code === null && status === "AWAITING_SEND" &&
                                            (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="w-full mt-2" variant={"outline"}>Inserir código de rastreio</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[70vw] rounded-lg">
                                                        <DialogHeader>
                                                            <DialogTitle>Cadastrar código de rastreio</DialogTitle>
                                                            <DialogDescription className="text-sm">
                                                                Insira o código para que seu cliente consiga acompanhar o trajeto do pedido.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <Input ref={inputRef} type="text" placeholder="Digite ou cole o código" className="my-4" />
                                                        <DialogFooter>
                                                            <Button type="submit" className="w-fit self-end" disabled={isLoading} onClick={async () => {
                                                                if (inputRef.current === null) return
                                                                setIsLoading(true)

                                                                const code = (inputRef.current as HTMLInputElement).value
                                                                await onSaveShippingCode({ code, id })
                                                                setIsLoading(false)
                                                            }}>
                                                                {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Enviar"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog >

                                            )
                                        }

                                        {shipping_code !== null && <span>Rastreio: {shipping_code} <CopyCode code={String(shipping_code)} /></span>}
                                    </span>
                                </address>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-3">
                            <div className="font-semibold">Informações do cliente</div>
                            < dl className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Cliente</dt>
                                    <dd>{adress.name}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Email</dt>
                                    <dd>
                                        <a href="mailto:">{adress.email}</a>
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Celular</dt>
                                    <dd>
                                        <a href="tel:">{adress.cellphone}</a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-3">
                            <div className="font-semibold">Payment Information</div>
                            <dl className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    {payment_method === "card" &&
                                        <dt className="flex items-center gap-1 text-muted-foreground">
                                            <CreditCard className="h-4 w-4" />
                                            Cartão
                                        </dt>
                                    }
                                    {payment_method === "paypal" &&
                                        <dt className="flex items-center gap-1 text-muted-foreground">
                                            <PaypalLogo className="h-4 w-4" />
                                            Paypal
                                        </dt>
                                    }
                                </div>
                            </dl>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground gap-2 flex items-center">
                            {`ID: ${id}`} <CopyCode code={id} />
                        </div>
                    </CardFooter>
                </Card >
            </DrawerContent>
        </Drawer>

    )
}