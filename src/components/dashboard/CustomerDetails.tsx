"use client"

import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card";

import {
    Drawer,
    DrawerContent,
    DrawerTrigger
} from "@/components/ui/drawer";

import { Adresses } from "@prisma/client";

export interface CustomerProps {
    name: string;
    email: string;
    adress: Adresses;
    isBuyer: boolean;
    created_at: number;
}

export function CustomersDetails({ name, email, adress, isBuyer, created_at }: CustomerProps) {
    return (
        <Card className="overflow-hidden max-lg:col-span-2 max-[1025px]:hidden h-fit">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Dados do usuário
                        <span className="sr-only">Copy Order ID</span>
                    </CardTitle>
                    <CardDescription>{new Date(created_at).toLocaleString("pt", {
                        month: "long", day: "numeric", year: "numeric", second: "numeric", minute: "numeric", hour: "numeric"
                    })}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                {adress && <>
                    <div className="grid gap-3 col-span-3">
                        <div className="font-semibold">Informações de entrega</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{name}</span>
                            <span>{`${adress.cap}, ${adress.city}`}</span>
                            <span>{adress.street}</span>
                        </address>
                    </div>
                    <Separator className="my-4" />
                </>
                }
                <div className="grid gap-3">
                    <div className="font-semibold">Informações do cliente</div>
                    < dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Cliente</dt>
                            <dd>{name}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                                <a className="underline" href="mailto:">{email}</a>
                            </dd>
                        </div>
                        {adress && <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Celular</dt>
                            <dd>
                                <a className="underline" href={`https://wa.me/${adress.cellphone}`}>{adress.cellphone}</a>
                            </dd>
                        </div>}
                    </dl>
                </div>
            </CardContent>
        </Card >
    )
}

export function MobileCustomersDetails({ name, email, adress, isBuyer, created_at }: CustomerProps) {
    return (
        <Drawer>
            <DrawerTrigger className="w-[100%] h-full max-h-[55px] absolute top-0 left-0"></DrawerTrigger>
            <DrawerContent>
                <Card className="max-lg:col-span-2 max-h-[90svh] overflow-auto rounded-none border-none">
                    <CardHeader className="flex flex-row items-start">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Dados do usuário
                                <span className="sr-only">Copy Order ID</span>
                            </CardTitle>
                            <CardDescription>{new Date(created_at).toLocaleString("pt", {
                                month: "long", day: "numeric", year: "numeric", second: "numeric", minute: "numeric", hour: "numeric"
                            })}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        {adress && <>
                            <div className="grid gap-3 col-span-3">
                                <div className="font-semibold">Informações de entrega</div>
                                <address className="grid gap-0.5 not-italic text-muted-foreground">
                                    <span>{name}</span>
                                    <span>{`${adress.cap}, ${adress.city}`}</span>
                                    <span>{adress.street}</span>
                                </address>
                            </div>
                            <Separator className="my-4" />
                        </>
                        }
                        <div className="grid gap-3">
                            <div className="font-semibold">Informações do cliente</div>
                            < dl className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Cliente</dt>
                                    <dd>{name}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Email</dt>
                                    <dd>
                                        <a className="underline" href="mailto:">{email}</a>
                                    </dd>
                                </div>
                                {adress && <div className="flex items-center justify-between">
                                    <dt className="text-muted-foreground">Celular</dt>
                                    <dd>
                                        <a className="underline" href={`https://wa.me/${adress.cellphone}`}>{adress.cellphone}</a>
                                    </dd>
                                </div>}
                            </dl>
                        </div>
                    </CardContent>
                </Card>
            </DrawerContent>
        </Drawer>

    )
}