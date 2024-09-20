import { CartProduct } from "@/app/(store)/cart/content";
import { useAuth } from "@clerk/nextjs";
import { CircleNotch, ShoppingCart } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Stripe from "stripe";
import { Button } from "./ui/button";


interface ModelSelectorProps {
    prices: Stripe.Price[];
    defaultPrice: number;
    getProductData: () => CartProduct | null;
    onSetModel: (id: string) => void
    activeColor: null | string
    category: string
}

export function ProductModelSelector({ prices, getProductData, onSetModel, activeColor, category }: ModelSelectorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)
    const [inStock, setInStock] = useState<{ stock: boolean, id: string }>({
        stock: false,
        id: ""
    })

    useEffect(() => {
        const verifyProductStock = () => {
            const condition = prices.reduce((acc, count) => {
                const sku = JSON.parse(count.metadata["SKU"]) as { stock: number }
                return acc + Number(sku.stock)
            }, 0) > 0

            if (condition) {
                return setCurrentPrice(() => {
                    const price = prices.filter(price => {
                        const sku = JSON.parse(price.metadata["SKU"]) as { stock: number }
                        return sku.stock > 0 && price
                    })[0]

                    if (prices.length > 1) {
                        onSetModel(price.id)
                    }
                    setInStock({ id: price.id as string, stock: true })
                    return price.unit_amount
                })
            }

        }

        verifyProductStock()
    }, [prices])

    const { pending } = useFormStatus()
    const { isSignedIn } = useAuth()
    const { push } = useRouter()

    const initOrder = () => {
        const product = getProductData()
        if (!product) return

        if (!activeColor && category !== "software") return
        setIsLoading(true)
        const products = JSON.stringify({ products: [{ ...product, quantity: 1 }], total: currentPrice })
        setTimeout(() => {
            push(`/order?data=${encodeURIComponent(products)}`);
            setIsLoading(false)
        }, 2000)
    }

    return (
        <>
            <div className="grid gap-4">
                {prices.length > 1 &&
                    <>
                        <h2 className="font-semibold">Prezzi:</h2>
                        <RadioGroup className="model-selector flex flex-col gap-2 items-center" name="price_id">
                            {prices.map(({ id, nickname, unit_amount, metadata }) => {
                                const sku = JSON.parse(metadata["SKU"]) as { stock: number }

                                return (
                                    <RadioGroupItem checked={id === inStock.id} required key={id} value={id} disabled={!inStock || Number(sku.stock) === 0}
                                        className="p-6 px-3 bg-accent rounded-2xl w-full flex justify-between relative gap-1 border data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            onSetModel(id)
                                            setCurrentPrice(unit_amount)

                                        }}>
                                        {unit_amount !== 0 && <p className="-z-0 font-semibold">{nickname}</p>}
                                        <p className={`-z-0 text-sm opacity-80 ${unit_amount === 0 && 'w-full'}`}>{unit_amount === 0 ? "Free" : unit_amount && (unit_amount / 100).toLocaleString('it-IT', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })}</p>
                                    </RadioGroupItem>
                                )
                            })}
                        </RadioGroup>
                    </>
                }
            </div >
            <footer className="flex gap-3">
                {isSignedIn && <>
                    {inStock.stock
                        ?
                        <>
                            <Button
                                className="p-5 bg-primary text-primary-foreground w-full rounded-xl disabled:opacity-90 transition-opacity duration-500"
                                onClick={initOrder}
                                type="button"
                            >
                                {isLoading ? (
                                    <div className='flex space-x-2 justify-center items-center h-screen'>
                                        <span className='sr-only'>Loading...</span>
                                        <div className='h-2 w-2 bg-background rounded-full duration-500 animate-bounce [animation-delay:-0.3s]'></div>
                                        <div className='h-2 w-2 bg-background rounded-full duration-500 animate-bounce [animation-delay:-0.15s]'></div>
                                        <div className='h-2 w-2 bg-background rounded-full duration-500 animate-bounce'></div>
                                    </div>
                                )
                                    : (currentPrice === 0 ? "Acquistare gratuitamente" : `Compra per ${currentPrice && (currentPrice / 100).toLocaleString('it-IT', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}`)
                                }
                            </Button>
                            <Button disabled={pending} variant={'outline'} className="w-[50px] h-max border grid place-content-center rounded-xl disabled:opacity-90 transition-opacity duration-500">
                                {pending
                                    ? <CircleNotch size={22} className="animate-spin" />
                                    : <ShoppingCart size={22} />
                                }
                            </Button>
                        </>
                        :

                        <Button disabled variant={'secondary'} className="py-5 w-full rounded-xl">
                            Prodotto non disponibile
                        </Button>
                    }
                </>}

                {!isSignedIn && <>
                    <Button disabled variant={'secondary'} className="py-5 w-full rounded-xl">
                        Devi essere autenticato per acquistare!
                    </Button>
                </>}
            </footer>
        </>
    )
}