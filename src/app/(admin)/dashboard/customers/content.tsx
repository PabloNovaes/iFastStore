'use client'

import { CustomerProps, CustomersDetails, MobileCustomersDetails } from "@/components/dashboard/CustomerDetails"
import { CustomersCharts } from "@/components/dashboard/CustomersChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { useEffect, useState } from "react"

const buyerStatus: { [key: string]: boolean } = {
    true: "Cliente",
    false: "Usuário",
} as any

const tabs: { isBuyer: string }[] = [
    { isBuyer: "true" },
    { isBuyer: "false" },
]


export function Orders() {
    const [customers, setCustomers] = useState<CustomerProps[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState(customers[0])
    const [statusFilter, setFilter] = useState("all")

    useEffect(() => {
        const fecthData = async () => {
            const res = await fetch("/api/admin/users/customers", {
                next: {
                    tags: ["load-buyers"]
                }, cache: "no-store"
            })
            const data = await res.json()
            setCustomers(data as CustomerProps[])
            setSelectedCustomer(data[0])
        }
        fecthData()
    }, [])


    if (!customers) return

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full">
                <Card className="col-span-2 h-fit">
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
                                            <TableHead className="hidden md:table-cell">Date</TableHead>
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
                                                        <TableCell>
                                                            {`${new Date(created_at).toLocaleString("it-IT", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            })}`}
                                                        </TableCell>
                                                        {window.innerWidth <= 1025 && <MobileCustomersDetails {...selectedCustomer} />}
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                        }
                    </CardContent>
                </Card>

                <div className="grid gap-6 col-span-2 lg:col-span-1">
                    {customers && customers.length !== 0
                        ? <CustomersDetails {...(selectedCustomer)} />
                        : <Card className="h-fit col-span-2 lg:col-span-1">
                            <CardHeader className="text-start">
                                <CardTitle>Ainda não há usuarios</CardTitle>
                                <CardDescription>È aqui que você vera os dados de seus clientes.</CardDescription>
                            </CardHeader>
                        </Card>
                    }
                    {customers.length > 0 && <CustomersCharts data={[
                        {
                            tag: "Usuários", count: customers.filter(customer => String(customer.isBuyer) === "false").length, fill: "var(--color-users)"
                        },
                        {
                            tag: "Clientes", count: customers.filter(customer => String(customer.isBuyer) === "true").length, fill: "var(--color-customers)"
                        }
                    ]} />}
                </div>
            </div>
        </main>

    )
}
