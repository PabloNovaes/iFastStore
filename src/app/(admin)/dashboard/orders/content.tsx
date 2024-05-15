'use client'

import { MobileOrderOverview, OrderOverview } from "@/components/dashboard/OrderOverview"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Cardholder, CheckCircle, ListChecks, Package, Truck } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { ReactNode, useEffect, useState } from "react"
import { OrdersProps } from "../content"

const orderStatus: { [key: string]: string } = {
    AWAITING_PAYMENT: "Pagamento pendente",
    AWAITING_SEND: "Envio pendente",
    ORDER_DISPATCHED: "Enviado",
    ORDER_RECEIVED: "Entregue"
} as any

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
        status: "order_received"
    },
]


export function Orders() {
    const [orders, setOrders] = useState<OrdersProps[]>([])
    const [selectedOrder, setSelectedOrder] = useState(orders[0])
    const [statusFilter, setFilter] = useState("all")

    useEffect(() => {
        const fecthData = async () => {
            const response = await fetch("/api/admin/orders")
            const data = await response.json()
            setOrders(data)
            setSelectedOrder(data[0])
        }

        fecthData()
    }, [])

    const saveShippingCode = async (orderData: { code: string, id: string }) => {
        try {
            const response = await fetch("/api/admin/orders/shipping-code", {
                method: "PUT",
                body: JSON.stringify(orderData)
            })
            const data = await response.json()
            const { id } = data as OrdersProps

            setOrders((state) => {
                const index = state.findIndex(order => order.id === id)
                const ordersArray = [...state]
                ordersArray[index] = data

                return ordersArray
            })

            setSelectedOrder(data)
        } catch (err) {
            return console.log(err);

        }
    }

    if (orders.length === 0) return

    const filteredOrders = statusFilter === "all" ? orders : orders.filter(order => order.status === statusFilter.toUpperCase())

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full">
                <Card className="col-span-2 h-fit" style={{ maxHeight: "calc(100dvh - 110px)" }}>
                    <CardHeader className="px-7">
                        <CardTitle>Pedidos</CardTitle>
                        <CardDescription>Todos os pedidos da sua loja.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="all" className="flex items-center gap-2 pb-3 flex-wrap">
                            <RadioGroupItem onClick={() => setFilter("all")} value="all" key="all" className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">Todos</RadioGroupItem>
                            {tabs.map(({ status }) => (
                                <RadioGroupItem key={status} onClick={() => setFilter(status)} value={status} className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">{orderStatus[status.toUpperCase()]}</RadioGroupItem>
                            ))}
                        </RadioGroup>
                        {filteredOrders.length !== 0 ?
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="sm:table-cell">Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length !== 0 && filteredOrders.map((order) => {
                                        const { created_at, id, adress, status, total } = order
                                        return (
                                            <TableRow key={id} className="relative" onClick={() => setSelectedOrder(order)}>
                                                <TableCell>
                                                    {window.innerWidth <= 640 && <MobileOrderOverview onSaveShippingCode={saveShippingCode} {...selectedOrder} />}
                                                    <div className="font-medium">{adress.name}</div>
                                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                                        {adress.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="sm:table-cell">
                                                    {status === "AWAITING_PAYMENT" && <Badge className="text-xs" variant="blue">
                                                        <span className="hidden min-[455px]:inline">{orderStatus[status]}</span>
                                                        <Cardholder size={16} className="min-[455px]:hidden" />
                                                    </Badge>}
                                                    {status === "AWAITING_SEND" && <Badge className="text-xs" variant="destructive">
                                                        <span className="hidden min-[455px]:inline">{orderStatus[status]}</span>
                                                        <Package size={16} className="min-[455px]:hidden" />
                                                    </Badge>}
                                                    {status === "ORDER_DISPATCHED" && <Badge className="text-xs" variant="warning">
                                                        <span className="hidden min-[455px]:inline">{orderStatus[status]}</span>
                                                        <Truck size={16} className="min-[455px]:hidden" />
                                                    </Badge>}
                                                    {status === "ORDER_RECEIVED" && <Badge className="text-xs" variant="green">
                                                        <span className="hidden min-[455px]:inline">{orderStatus[status]}</span>
                                                        <CheckCircle size={16} className="min-[455px]:hidden" />
                                                    </Badge>}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{new Date(created_at).toLocaleString("pt-BR")}</TableCell>
                                                <TableCell className="text-right">{(total / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</TableCell>
                                            </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                            : <div className="text-center">Nenhum resultado</div>}
                    </CardContent>
                </Card>

                <OrderOverview onSaveShippingCode={saveShippingCode} {...selectedOrder} />
            </div>
        </main>

    )
}
