'use client'

import { ProductsPerOrderProps } from "@/app/(store)/account/content";
import { CustomerProps, CustomersDetails, MobileCustomersDetails } from "@/components/dashboard/CustomerDetails";
import { CustomersCharts } from "@/components/dashboard/CustomersChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, CreditCard, CurrencyDollar, Package } from "@phosphor-icons/react";
import { Order } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
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

const buyerStatus: { [key: string]: boolean } = {
    true: "Cliente",
    false: "Usuário",
} as any

const tabs: { isBuyer: string }[] = [
    { isBuyer: "true" },
    { isBuyer: "false" },
]


export function Dashboard() {
    const [orders, setOrders] = useState<OrdersProps[] | null>([]);
    const [customers, setCustomers] = useState<CustomerProps[] | null>(null)
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProps | null>(customers ? customers[0] : null)
    const [statusFilter, setFilter] = useState("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, customersRes] = await Promise.all([
                    fetch("/api/admin/orders", {
                        next: {
                            tags: ["load-orders"]
                        }, cache: "no-store",
                    }).then(res => res.json()),
                    fetch("/api/admin/users/customers", {
                        next: {
                            tags: ["load-buyers"]
                        }, cache: "no-store"
                    }).then(res => res.json())
                ]);
                setCustomers(customersRes as CustomerProps[])
                setSelectedCustomer(customersRes[0])

                setOrders(() => ordersRes.length !== 0 ? ordersRes : null);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    const renderTotalRevenue = () => (
        orders?.length == 0 ? (
            <Skeleton className="w-[60%] h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders && orders.filter(order => order.status !== "AWAITING_PAYMENT")
                    .reduce((acc, { total }) => acc + total / 100, 0)
                    .toLocaleString("it-IT", { style: "currency", currency: "EUR" })
                }
            </span>
        )
    );

    const renderOrderCount = () => (
        orders?.length == 0 ? (
            <Skeleton className="w-[60%] h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders && orders.filter(order => order.status !== "AWAITING_PAYMENT").length}
            </span>
        )
    );

    const renderPendingOrders = () => (
        orders?.length == 0 ? (
            <Skeleton className="w-[60%] h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {orders && orders.filter(order => order.status === "AWAITING_SEND").length}
            </span>
        )
    );

    const renderUsers = () => (
        !customers ? (
            <Skeleton className="w-[60%] h-8" />
        ) : (
            <span className="text-2xl font-bold fade-in-0 animate-in duration-500">
                {customers.length}
            </span>
        )
    );

    return (
        <main className="p-4 sm:px-6 grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="grid gap-4 h-full xl:col-span-4 " style={{ gridTemplateRows: "min-content" }}>
                <section className="grid gap-4 grid-cols-1 sm:grid-cols-3 col-span-full">
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
                </section>

                <section className="grid gap-4 grid-cols-1 md:grid-cols-5 grid-rows-1">
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Pedidos recentes</CardTitle>
                                <CardDescription>Pedidos que foram pagos recentemente.</CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href="/dashboard/orders">
                                    Ver todas
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-x-hidden" style={{ maxHeight: "calc(100svh - 360px)" }}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Valor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders?.length === 0 ? (
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
                                    ) : (orders ? (
                                        orders
                                            .slice(0, 5)
                                            .map(({ id, adress, total, created_at }) => (
                                                <TableRow key={id}>
                                                    <TableCell>
                                                        <div className="font-medium">{adress.name}</div>
                                                        <div className="text-xs text-muted-foreground md:inline">
                                                            {adress.email}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(created_at).toLocaleString('pt-BR', {
                                                            dateStyle: "short"
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                <p className="pt-4">Nenhum resultado para mostrar</p>
                                            </TableCell>
                                        </TableRow>

                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 h-full">
                        <CardHeader className="px-7">
                            <CardTitle>Clientes</CardTitle>
                            <CardDescription>Todos os clientes da sua loja.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue="all" className="flex items-center gap-2 pb-3 flex-wrap">
                                <RadioGroupItem onClick={() => setFilter("all")} value="all" key="all" className="border px-4 text-sm py-1 rounded-lg bg-muted/40 transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-secondary">Todos</RadioGroupItem>
                                {tabs.map(({ isBuyer }) => (
                                    <RadioGroupItem key={isBuyer} onClick={() => setFilter(isBuyer)} value={isBuyer} className="border px-4 text-sm py-1 rounded-lg bg-muted/40 transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-secondary">{buyerStatus[isBuyer]}</RadioGroupItem>
                                ))}
                            </RadioGroup>
                            {!customers || customers.length === 0
                                ? <div className="text-center mt-[10px]">Nenhum resultado</div>
                                : <div className="overflow-auto" style={{ maxHeight: "calc(100svh - 285px)" }}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(statusFilter === "all"
                                                ? customers
                                                : customers.filter(customer => String(customer.isBuyer) === statusFilter))
                                                .map((customer) => {
                                                    const { name, email, created_at } = customer
                                                    return (
                                                        <TableRow key={email + created_at} className="relative" onClick={() => setSelectedCustomer(customer)}>
                                                            <TableCell>
                                                                <div className="font-medium">{name}</div>
                                                                <div className="text-sm text-muted-foreground md:inline">
                                                                    {email}
                                                                </div>
                                                            </TableCell>
                                                            {window.innerWidth <= 1025 && selectedCustomer && <MobileCustomersDetails {...selectedCustomer} />}
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </div>
                            }
                        </CardContent>
                    </Card>
                </section>

            </div>
            <div className="grid gap-4 pb-6 sm:pb-0">
                {customers && customers.length !== 0
                    ? selectedCustomer && <CustomersDetails {...(selectedCustomer)} />
                    : <Card className="h-fit col-span-2 lg:col-span-1">
                        <CardHeader className="text-start">
                            <CardTitle>Ainda não há usuarios</CardTitle>
                            <CardDescription>È aqui que você vera os dados de seus clientes.</CardDescription>
                        </CardHeader>
                    </Card>
                }
                {customers && customers.length > 0 && <CustomersCharts data={[
                    {
                        tag: "Usuários", count: customers.filter(customer => String(customer.isBuyer) === "false").length, fill: "var(--color-users)"
                    },
                    {
                        tag: "Clientes", count: customers.filter(customer => String(customer.isBuyer) === "true").length, fill: "var(--color-customers)"
                    }
                ]} />}
            </div>
        </main>
    );
}
