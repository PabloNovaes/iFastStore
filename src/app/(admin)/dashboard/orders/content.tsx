'use client'

import { MobileOrderOverview, OrderOverview } from "@/components/dashboard/OrderDetails"
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
import { Cardholder, CheckCircle, Package, Truck } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { useEffect, useState } from "react"
import { OrdersProps } from "../content"

const orderStatus: { [key: string]: string } = {
    AWAITING_PAYMENT: "Pagamento pendente",
    AWAITING_SEND: "Envio pendente",
    ORDER_DISPATCHED: "Enviado",
    ORDER_DELIVERED: "Entregue"
} as any

const tabs: { status: string }[] = [
    { status: "awaiting_payment" },
    { status: "awaiting_send" },
    { status: "order_dispatched" },
    { status: "order_delivered" },
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
            throw err

        }
    }

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full">
                <Card className="col-span-2 h-fit">
                    <CardHeader className="px-7">
                        <CardTitle>Pedidos</CardTitle>
                        <CardDescription>Todos os pedidos da sua loja.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="all" className="flex items-center gap-2 pb-3 flex-wrap">
                            <RadioGroupItem onClick={() => setFilter("all")} value="all" key="all" className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 bg-muted/40 data-[state=checked]:bg-primary data-[state=checked]:text-secondary">Todos</RadioGroupItem>
                            {tabs.map(({ status }) => (
                                <RadioGroupItem key={status} onClick={() => setFilter(status)} value={status} className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 bg-muted/40 data-[state=checked]:bg-primary data-[state=checked]:text-secondary">{orderStatus[status.toUpperCase()]}</RadioGroupItem>
                            ))}
                        </RadioGroup>
                        {(statusFilter === "all"
                            ? orders
                            : orders.filter(order => order.status === statusFilter.toUpperCase())).length !== 0 ?
                            <div className="overflow-auto" style={{ maxHeight: "calc(100svh - 285px)" }}>
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
                                        {(statusFilter === "all"
                                            ? orders
                                            : orders.filter(order => order.status === statusFilter.toUpperCase()))
                                            .map((order) => {
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
                                                            {status === "ORDER_DELIVERED" && <Badge className="text-xs" variant="green">
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
                            </div>
                            : <div className="text-center mt-[10px]">Nenhum resultado</div>}
                    </CardContent>
                </Card>

                {orders.length !== 0
                    ? <OrderOverview onSaveShippingCode={saveShippingCode} {...selectedOrder} />
                    :
                    <Card className="h-fit col-span-2 lg:col-span-1">
                        <CardHeader className="text-start">
                            <CardTitle>Nenhum pedido encontrado</CardTitle>
                            <CardDescription>È aqui que você vera os detalhes dos pedidos de seus clientes.</CardDescription>
                        </CardHeader>
                    </Card>
                }
            </div>
        </main>

    )
}
