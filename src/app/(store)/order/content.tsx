'use client'

import { CreateAdressSchema, CreteAdressForm } from "@/components/CreateAdressForm";
import { OrderProductsCard } from "@/components/InitOrderProductsCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, CircleNotch, CreditCard, PaypalLogo, Plus } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Stripe from "stripe";
import { AdressProps } from "../../api/adresses/route";
import { CartProduct } from "../cart/content";

interface Product extends CartProduct, Omit<Stripe.Product, "id"> {
    shipping_tax: number
}

export function Order() {
    const [adress, setAdress] = useState<AdressProps[]>([])
    const [finished, setFinished] = useState(false)
    const [selected, setSelected] = useState(false)
    const [pending, setPending] = useState(false)


    const { user } = useUser();
    const { replace, push } = useRouter()
    const path = usePathname()

    useEffect(() => {
        const fecthData = async () => {
            try {
                if (!user) return
                const response = await fetch(`/api/adresses?userId=${user.id}`)

                const data = await response.json()
                setAdress(data)
            } catch (err) {
                throw err
            }
        }

        fecthData()
    }, [user])

    const formRef = useRef(null)
    const searchParams = useSearchParams()
    const params = searchParams.get('data')

    if (!params || !user) return

    const calculateShippingTax = () => {
        let tax

        const productsTax = products.map((product) => {
            return product.shipping_tax
        })

        const taxIsPaid = productsTax.some(tax => tax !== 0)

        if (taxIsPaid) {
            tax = productsTax.find(tax => tax !== 0)
        } else {
            tax = 0
        }

        return tax
    }

    const { products, total } = JSON.parse(params) as { products: Product[], total: number }

    const formatedTotal = ((total + Number(calculateShippingTax())) / 100).toLocaleString("it-IT", {
        style: 'currency',
        currency: 'EUR'
    })


    const createOrder = async (event: FormEvent) => {
        try {
            event.preventDefault()
            setPending(true)

            const formData = Object.fromEntries(new FormData(event.target as HTMLFormElement).entries())

            const orderData = {
                payment_method: formData['payment_method'],
                products,
                userId: user.id,
                adressId: adress[0].id,
                shipping_tax: Number(calculateShippingTax()),
                total: total + Number(calculateShippingTax())
            }

            await fetch('/api/order/create', {
                method: 'POST',
                body: JSON.stringify(orderData)
            })


            setFinished(true)
            replace(path)
            push("/account")
        } catch (err) {
            toast.error("Si è verificato un errore imprevisto!")
            throw err
        }
        finally {
            setPending(false)
        }
    }

    const createAdress = async (data: CreateAdressSchema) => {
        if (!user) return

        const { name, cap, ...rest } = data
        const response = await fetch(`/api/adresses?userId=${user.id}`, {
            method: 'POST',
            body: JSON.stringify({ ...rest, userId: user ? user.id : "" as string, name, cap: Number(cap) })
        })

        const newAdress = await response.json()
        setAdress([newAdress])
    }

    return (
        <main className="p-5 grid max-md:grid-cols-1 grid-cols-2 gap-6 max-w-5xl m-auto">
            <div className="w-full max-h-[70dvh] overflow-auto gap-5 flex flex-col">
                {products.map((product: CartProduct) => <OrderProductsCard key={product.productId} {...product} />)}
            </div>
            <div>

                <div className="rounded-xl w-full border gap-2 flex flex-col overflow-hidden min-h-32 h-fit p-3 ">
                    <div className="grid gap-3">
                        <div className="font-semibold">{"Dettagli dell'ordine"}</div>
                        <ul className="grid gap-3">
                            {products.map(({ name, quantity, price, productId }) => {
                                const { nickname } = price
                                return (
                                    <li key={productId} className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            {nickname ? `${name} - ${nickname}` : name} x <span>{quantity}</span>
                                        </span>
                                        <span>{price.unit_amount && (price.unit_amount / 100).toLocaleString("it-IT", {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Totale parziale</span>
                                <span>{formatedTotal}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Spedizione</span>
                                <span>
                                    {Number(calculateShippingTax()) !== 0
                                        ?
                                        (Number(calculateShippingTax()) / 100).toLocaleString("it-IT", {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })
                                        : "Free"
                                    }
                                </span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>0.00 €</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>{formatedTotal}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-4">
                        {adress.length !== 0 ? <div className="grid gap-3" style={{ gridColumn: "1/4" }}>
                            <div className="font-semibold">Informazioni di consegna</div>
                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                <span>{adress[0].name}</span>
                                <span>{adress[0].street}</span>
                                <span>{`${adress[0].cap}, ${adress[0].city}`}</span>
                                <span>{adress[0].complement}</span>
                            </address>
                        </div>
                            : <CreteAdressForm onSubmit={createAdress} >
                                <Button variant={"outline"} className="flex justify-center h-fit gap-2 p-2 rounded-lg" style={{ gridColumn: '1/4' }}>
                                    <Plus size={18} />
                                    <h2 className="font-semibold text-md">{"Registra i dettagli della consegna"}</h2>
                                </Button>
                            </CreteAdressForm>
                        }
                    </div>
                    <Separator className="my-4" />
                    <form onSubmit={(event: FormEvent) => createOrder(event)} ref={formRef}>

                        <RadioGroup className="flex gap-2 items-center" name="payment_method">
                            <RadioGroupItem value="card" onClick={() => setSelected(true)} className="p-2 bg-accent rounded-lg flex flex-1 items-center gap-2 justify-center border data-[state=checked]:border-blue-400 transition-colors duration-500">
                                <CreditCard size={18} />
                                Carta
                            </RadioGroupItem>
                            <RadioGroupItem value="paypal" onClick={() => setSelected(true)} className="p-2 bg-accent rounded-lg flex flex-1 items-center gap-2 justify-center border data-[state=checked]:border-blue-400 transition-colors duration-500">
                                <PaypalLogo size={18} />
                                Paypal
                            </RadioGroupItem>
                        </RadioGroup>

                        <Button disabled={!selected || adress.length === 0 ? true : false} className="w-full p-5 mt-4 transition-all duration-500">
                            {pending ? <CircleNotch size={22} className={`${finished && 'hidden'} animate-spin`} /> : <p className={`${finished && 'hidden'} `}>{"Confermare l'ordine"}</p>}
                            {finished && <CheckCircle size={22} />}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}