'use client'

import { UserButton, useUser } from "@clerk/nextjs"
import { Cardholder, ListChecks, Package, PencilSimple, Plus, SmileySad, Truck } from "@phosphor-icons/react"
import { Order, Products_per_order } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Stripe from "stripe"

import { CreateAdressSchema, CreteAdressForm } from "@/components/CreateAdressForm"
import { OrderProductCard } from "@/components/OrderProducts"
import { UpdateAddressForm } from "@/components/UpdateAddressForm"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdressProps } from "../../api/adresses/route"

export interface ProductsPerOrderProps extends Products_per_order {
  price: Stripe.Price
}

export interface OrdersProps extends Order {
  products: ProductsPerOrderProps[]
}

interface TabProps {
  name: React.ReactNode
  icon: React.ReactNode
  status: string
}

const tabs: TabProps[] = [
  {
    name: <p className="sm:text-xs text-[11px] font-normal">attesa<br />pagamento</p>,
    icon: <Cardholder size={18} />,
    status: "awaiting_payment"
  },
  {
    name: <p className="sm:text-xs text-[11px] font-normal">preparazione <br />{"dell'ordine"} </p>,
    icon: <Package size={18} />,
    status: "awaiting_send"
  },
  {
    name: <p className="sm:text-xs text-[11px] font-normal">order < br /> spedito</p>,
    icon: <Truck size={18} />,
    status: "order_dispatched"
  },
  {
    name: <p className="sm:text-xs text-[11px] font-normal">richiesta <br /> ricevuta</p>,
    icon: <ListChecks size={18} />,
    status: "order_delivered"
  },
]

export function Account() {
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState<AdressProps[]>([])
  const [orders, setOrders] = useState<OrdersProps[]>([])

  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const [addressResponse, ordersResponse] = await Promise.all([
          fetch(`/api/adresses?userId=${user.id}`),
          fetch(`/api/order?userId=${user.id}`)
        ])
        const addressData = await addressResponse.json()
        const ordersData = await ordersResponse.json()
        setAddress(addressData)
        setOrders(ordersData)
      } catch (err) {
        console.error("Error fetching account data:", err)
        toast.error("Failed to load account data")
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      fetchAccountData()
    }
  }, [user, isLoaded])

  const handleSubmit = async (data: CreateAdressSchema) => {
    if (!user) return
    try {
      const { name, cap, ...rest } = data
      const response = await fetch(`/api/adresses/${user.id}`, {
        method: 'POST',
        body: JSON.stringify({ ...rest, userId: user.id, name, cap: Number(cap) }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to create address')
      const newAddress = await response.json()
      setAddress([newAddress])
      toast.success("Address created successfully")
    } catch (err) {
      console.error("Error creating address:", err)
      toast.error("Failed to create address")
    }
  }

  const updateAddress = async (data: CreateAdressSchema): Promise<void> => {
    if (!user || address.length === 0) return
    try {
      const { cap, ...rest } = data
      const response = await fetch(`/api/adresses/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...rest, cap: Number(cap), id: address[0].id }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to update address')
      const updatedAddress = await response.json()
      setAddress([updatedAddress])
      toast.success("Address updated successfully")
    } catch (err) {
      console.error("Error updating address:", err)
      toast.error("Failed to update address")
    }
  }

  const handleConfirmDelivery = (orderId: string) => {
    setOrders((prevOrders) => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "ORDER_DELIVERED" } : order
      )
    )
  }

  if (!isLoaded) return null

  return (
    <main className="p-5 flex flex-col gap-6 max-w-5xl m-auto" style={{ minHeight: 'calc(100svh - 50px)' }}>
      {!user ? (
        <div className="flex flex-1 items-center opacity-80 justify-center gap-4 flex-col">
          <SmileySad size={60} aria-hidden="true" />
          <p className="font-medium text-2xl text-center">Oops...sembra che tu non sia autenticato</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <UserButton 
              userProfileMode="modal" 
              appearance={{ elements: { avatarBox: { width: '4rem', height: '4rem' } } }} 
            />
            <span>
              <p className="max-sm:text-xs text-sm font-semibold">{user.fullName}</p>
              <p className="max-sm:text-xs text-sm">{user.primaryEmailAddress?.emailAddress}</p>
            </span>
          </div>

          <Separator className="w-full" />
          <h2 className="font-semibold text-lg">Ordine</h2>
          <div className="flex gap-6 h-full flex-wrap">
            <Tabs defaultValue="awaiting_payment" className="flex-[2] md:min-w-[416px] h-fit">
              <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl">
                {tabs.map(({ icon, name, status }) => {
                  const filteredOrders = orders.filter(order => order.status.toLowerCase() === status)
                  return (
                    <TabsTrigger 
                      key={status} 
                      value={status}
                      className="tab-trigger flex-col rounded-lg relative"
                    >
                      {filteredOrders.length > 0 && (
                        <span className="size-5 transition-opacity absolute top-1 right-2 grid place-content-center text-xs md:text-sm rounded-full bg-primary text-primary-foreground">
                          {filteredOrders.length}
                        </span>
                      )}
                      {icon}
                      {name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              {tabs.map(({ status }) => {
                const filteredOrders = orders.filter(order => order.status.toLowerCase() === status)
                return (
                  <TabsContent key={status} value={status} className="grid gap-2 h-fit data-[state=inactive]:mt-0">
                    {filteredOrders.length === 0 ? (
                      <div className="max-h-[334px] overflow-auto gap-2 text-center p-1 h-fit text border rounded-lg">
                        Nessun ordine ancora
                      </div>
                    ) : (
                      filteredOrders.reverse().map((order) => (
                        <Accordion type="single" collapsible key={order.id} className="border h-fit px-2 rounded-xl w-full bg-white">
                          <AccordionItem value={order.id}>
                            <OrderProductCard onConfirmDelivery={handleConfirmDelivery} {...order} />
                          </AccordionItem>
                        </Accordion>
                      ))
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
            <Card className="rounded-xl md:max-w-72 w-full h-fit text-sm">
              {address.length === 0 ? (
                <CardHeader className="flex items-center justify-between">
                  {isLoading ? (
                    <div className="flex gap-3 w-full">
                      <Skeleton className="w-full h-9" />
                      <Skeleton className="w-full size-9" />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-md font-semibold">Registra i dettagli della consegna</CardTitle>
                      <CreteAdressForm onSubmit={handleSubmit}>
                        <Button variant="outline" size="icon" aria-label="Add delivery details">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CreteAdressForm>
                    </>
                  )}
                </CardHeader>
              ) : (
                <>
                  <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
                    <CardTitle className=" font-semibold text-lg">Dati di consegna</CardTitle>
                    <UpdateAddressForm currentData={address[0]} onSubmit={updateAddress}>
                      <Button className="rounded-lg" variant="outline" size="icon" aria-label="Edit delivery details">
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                    </UpdateAddressForm>
                  </CardHeader>
                  <CardContent className="space-y-6 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">{"Informazioni sull'indirizzo"}</h3>
                      <address className="not-italic text-muted-foreground space-y-1">
                        <p>{address[0].name}</p>
                        <p>{address[0].street}</p>
                        <p>{`${address[0].cap}, ${address[0].city}`}</p>
                        <p>{address[0].complement}</p>
                      </address>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Mie dati</h3>
                      <dl className="grid gap-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Cliente</dt>
                          <dd>{address[0].name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>
                            <a href={`mailto:${address[0].email}`} className="hover:underline">
                              {address[0].email}
                            </a>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Cellulare</dt>
                          <dd>
                            <a href={`tel:${address[0].cellphone}`} className="hover:underline">
                              {address[0].cellphone}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </main>
  )
}