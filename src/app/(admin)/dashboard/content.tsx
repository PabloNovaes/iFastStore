'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, CreditCard, CurrencyDollar, Package, Users } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { ProductsPerOrderProps } from "@/app/(store)/account/content";
import { Order } from "@prisma/client";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Stripe from "stripe";

export interface OrdersProps extends Order {
    adress: {
        userImg: string;
        id: string;
        complement: string | null;
        city: string;
        cap: number;
        street: string;
        userId: string;
        name: string;
        cellphone: string;
        email: string;
    };
    products: ProductsPerOrderProps[]
    price: Stripe.Price
}

export function Dashboard() {
    const [customers, setCustomers] = useState<Stripe.Customer[]>([])
    const [orders, setOrders] = useState<OrdersProps[]>([])

    useEffect(() => {
        const fecthData = async () => {
            const responses = await Promise.all([
                fetch("/api/admin/orders"),
                fetch("/api/admin/users")
            ])
            const [ordersResponse, customersResponse] = responses.map(async (res) => await res.json())

            setOrders(await ordersResponse)
            setCustomers(await customersResponse)
        }

        fecthData()
    }, [])

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 h-full" style={{ gridTemplateRows: "min-content 1fr" }}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Rendimento total
                        </CardTitle>
                        <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                orders?.filter(order => order.status !== "AWAITING_PAYMENT")
                                    .reduce((acc, { total }) => {
                                        return acc + (total / 100)
                                    }, 0).toLocaleString("it-IT", { style: "currency", currency: "EUR" })
                            }</div>
                        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de vendas
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders?.filter(order => order.status !== "AWAITING_PAYMENT").length}</div>
                        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pedidos aguardando envio
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.filter((order => order.status === "AWAITING_SEND")).length}</div>
                        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                        {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
                    </CardContent>
                </Card>


                <Card className="col-span-full ">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Pedidos</CardTitle>
                            <CardDescription>
                                Pedidos que foram pagos recentemente.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="#">
                                Ver todas
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Quantia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.filter(order => order.status === "AWAITING_SEND")
                                    .map(({ id, adress, total, created_at }, indx) => {
                                        if (indx >= 3) return
                                        return (
                                            <TableRow key={id}>
                                                <TableCell>
                                                    <div className="font-medium">{adress.name}</div>
                                                    <div className="hidden text-xs text-muted-foreground md:inline">
                                                        {adress.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{new Date(created_at).toLocaleString('pt-BR')}</TableCell>
                                                <TableCell className="text-right">
                                                    {(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                                </TableCell>
                                            </TableRow>

                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}