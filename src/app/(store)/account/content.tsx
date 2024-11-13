'use client'

import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Cardholder, ListChecks, Package, PencilSimple, Truck, UserCircle } from "@phosphor-icons/react"
import { Adresses, Order, Products_per_order } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Stripe from "stripe"

import { CreateAdressSchema } from "@/components/CreateAdressForm"
import { NotResultsFound } from "@/components/NotResults"
import { OrderProductCard } from "@/components/OrderProducts"
import { UpdateAddressForm } from "@/components/UpdateAddressForm"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Loading } from "../../../components/accountLoading"

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
  const [address, setAddress] = useState<Adresses[]>([])
  const [orders, setOrders] = useState<OrdersProps[] | null>(null)

  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const [addressResponse, ordersResponse] = await Promise.all([
          fetch(`/api/adresses?userId=${user.id}`, {
            cache: "no-store", next: {
              tags: ["load-adress"]
            }
          }),
          fetch(`/api/order?userId=${user.id}`, {
            cache: "no-store", next: {
              tags: ["load-orders"]
            }
          })
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
        cache: "no-store",
        next: {
          tags: ['load-adress']
        }
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
      (prevOrders as OrdersProps[]).map(order =>
        order.id === orderId ? { ...order, status: "ORDER_DELIVERED" } : order
      )
    )
  }

  if (!isLoaded && !user) return <Loading />

  if (isLoaded && !user) return (
    <div className="flex flex-col items-center justify-center m-auto text-center px-4 col-span-full" style={{ minHeight: 'calc(100svh - 50px)' }}>
      <Image src={"/assets/icons/user-x.svg"} width={80} height={80} alt="user" className="dark:invert opacit-70" />
      <h2 className="text-2xl font-bold mb-2">
        Non autenticato
      </h2>
      <p className="text-muted-foreground max-w-md">
        Non sei autenticato e pertanto non puoi visualizzare i dati del tuo account. Accedi per continuare.
      </p>
      <div className="py-7 w-full max-w-[300px]">
        <SignInButton mode="modal">
          <RainbowButton className="relative text-md text-center space-x-5">
            <UserCircle weight="duotone" className="mr-1" size={20} />
            Login
          </RainbowButton>
        </SignInButton>
      </div>
    </div>
  )

  return (
    <main className="p-5 flex flex-col gap-4 max-w-5xl m-auto" style={{ minHeight: 'calc(100svh - 50px)' }}>
      <div className="flex items-center gap-3 bg-muted/40 border rounded-2xl p-3">
        <UserButton
          userProfileMode="modal"
          appearance={{ elements: { avatarBox: { width: '4rem', height: '4rem' } } }}
        />
        <span>
          <p className="max-sm:text-xs text-sm font-semibold">{user.fullName}</p>
          <p className="max-sm:text-xs text-sm">{user.primaryEmailAddress?.emailAddress}</p>
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-4 h-full flex-wrap flex-3 w-full">
          {orders ? <Tabs defaultValue="awaiting_payment" className="flex-[2] md:min-w-[416px] h-fit">
            <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl border">
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
                <TabsContent key={status} value={status} className="grid gap-2 h-fit mt-4 data-[state=inactive]:mt-0">
                  {filteredOrders.length === 0 ? (
                    <div className="border rounded-xl bg-muted/40">
                      <NotResultsFound className="h-fit py-6 scale-75 sm:scale-100" title="Nessun ordine da mostrare" description="Non hai ancora effettuato alcun ordine" />
                    </div>
                  ) : (
                    filteredOrders.reverse().map((order) => (
                      <Accordion type="single" collapsible key={order.id} className="border h-fit px-2 rounded-xl w-full dark:bg-muted/40">
                        <AccordionItem value={order.id}>
                          <OrderProductCard address={address[0]} onConfirmDelivery={handleConfirmDelivery} {...order} />
                        </AccordionItem>
                      </Accordion>
                    ))
                  )}
                </TabsContent>
              )
            })}
          </Tabs> : (
            <div className="flex gap-4 h-full flex-wrap flex-3 w-full">
              <Tabs defaultValue="tab1" className="flex-[2] md:min-w-[416px] h-fit">
                <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl border">
                  {[1, 2, 3, 4].map((tab) => (
                    <TabsTrigger key={tab} value={`tab${tab}`} className="tab-trigger flex-col rounded-lg relative">
                      <Skeleton className="rounded-md h-6 w-6 mb-1" />
                      <Skeleton className="rounded-md h-4 w-16" />
                    </TabsTrigger>
                  ))}
                </TabsList>
                {[1, 2, 3, 4].map((tab) => (
                  <TabsContent key={tab} value={`tab${tab}`} className="data-[state=inactive]:mt-0 grid gap-2 h-fit mt-4">
                    {[1, 2].map((item) => (
                      <Accordion key={item} type="single" collapsible className="border h-fit px-2 rounded-xl w-full bg-muted/40">
                        <AccordionItem value={`item${item}`}>
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <Skeleton className="rounded-md h-12 w-12 " />
                              <div>
                                <Skeleton className="rounded-md h-4 w-32 mb-2" />
                                <Skeleton className="rounded-md h-3 w-24" />
                              </div>
                            </div>
                            <Skeleton className="rounded-md h-8 w-24" />
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>

        {address.length === 0 ? (
          <Card className="rounded-xl md:max-w-72 w-full h-fit text-sm overflow-auto">
            <CardHeader className="dark:bg-input bg-muted/40 flex flex-row items-center justify-between">
              <CardTitle className="font-semibold text-lg">
                <Skeleton className="rounded-md h-6 w-32" />
              </CardTitle>
              <Skeleton className="rounded-md h-8 w-8" />
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div>
                <Skeleton className="rounded-md h-5 w-40 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="rounded-md h-4 w-full" />
                  <Skeleton className="rounded-md h-4 w-full" />
                  <Skeleton className="rounded-md h-4 w-3/4" />
                </div>
              </div>
              <Separator />
              <div>
                <Skeleton className="rounded-md h-5 w-24 mb-2" />
                <dl className="grid gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between">
                      <Skeleton className="rounded-md h-4 w-20" />
                      <Skeleton className="rounded-md h-4 w-32" />
                    </div>
                  ))}
                </dl>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-xl md:max-w-72 w-full h-fit text-sm overflow-auto">
            <CardHeader className="bg-muted dark:bg-input/20 flex flex-row items-center justify-between ">
              <CardTitle className="font-semibold text-lg">Dati di consegna</CardTitle>
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
          </Card>
        )}
      </div>
    </main>
  )
}