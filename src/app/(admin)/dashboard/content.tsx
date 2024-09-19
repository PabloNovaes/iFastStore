'use client'

import { ProductsPerOrderProps } from "@/app/(store)/account/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, CreditCard, CurrencyDollar, Package, Users } from "@phosphor-icons/react";
import { Order } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    products: ProductsPerOrderProps[];
    price: Stripe.Price;
}

export function Dashboard() {
    const [customers, setCustomers] = useState<Stripe.Customer[] | null>(null);
    const [orders, setOrders] = useState<OrdersProps[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, customersRes] = await Promise.all([
                    fetch("/api/admin/orders").then(res => res.json()),
                    fetch("/api/admin/users").then(res => res.json())
                ]);

                setOrders(ordersRes);
                setCustomers(customersRes);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    const renderTotalRevenue = () => (
        !orders ? (
            <Skeleton className="w-24 h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders.filter(order => order.status !== "AWAITING_PAYMENT")
                    .reduce((acc, { total }) => acc + total / 100, 0)
                    .toLocaleString("it-IT", { style: "currency", currency: "EUR" })
                }
            </span>
        )
    );

    const renderOrderCount = () => (
        !orders ? (
            <Skeleton className="w-16 h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders.filter(order => order.status !== "AWAITING_PAYMENT").length}
            </span>
        )
    );

    const renderPendingOrders = () => (
        !orders ? (
            <Skeleton className="w-20 h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders.filter(order => order.status === "AWAITING_SEND").length}
            </span>
        )
    );

    const renderUsers = () => (
        !customers ? (
            <Skeleton className="w-20 h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {customers.length}
            </span>
        )
    );

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 h-full" style={{ gridTemplateRows: "min-content 1fr" }}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rendimento total</CardTitle>
                        <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>{renderTotalRevenue()}</CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de vendas</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>{renderOrderCount()}</CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos aguardando envio</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>{renderPendingOrders()}</CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>{renderUsers()}</CardContent>
                </Card>

                <Card className="col-span-full">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Pedidos</CardTitle>
                            <CardDescription>Pedidos que foram pagos recentemente.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="#">
                                Ver todas
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent style={{ overflow: "auto", maxHeight: "calc(100svh - 360px)" }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Quantia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!orders ? (
                                    Array.from({ length: 5 }).map((_, indx) => (
                                        <TableRow key={indx}>
                                            <TableCell>
                                                <Skeleton className="w-28 h-6" />
                                                <Skeleton className="w-full h-6 mt-3" />
                                            </TableCell>
                                            <TableCell><Skeleton className="w-full h-6" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="w-24 h-6" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            <p className="pt-4">Nenhum resultado para mostrar</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders
                                        .filter(order => order.status === "AWAITING_SEND")
                                        .slice(0, 5)
                                        .map(({ id, adress, total, created_at }) => (
                                            <TableRow key={id}>
                                                <TableCell>
                                                    <div className="font-medium">{adress.name}</div>
                                                    <div className="hidden text-xs text-muted-foreground md:inline">
                                                        {adress.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(created_at).toLocaleString('pt-BR')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
