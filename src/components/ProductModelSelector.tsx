import { CartProduct } from "@/app/(store)/cart/content";
import { useAuth } from "@clerk/nextjs";
import { CircleNotch, ShoppingCart } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import Stripe from "stripe";
import { Button } from "./ui/button";


interface ModelSelectorProps {
    prices: Stripe.Price[];
    defaultPrice: number;
    getProductData: () => CartProduct | null;
    onSetModel: (id: string) => void
    activeColor: null | string
}

export function ProductModelSelector({ prices, defaultPrice, getProductData, onSetModel, activeColor }: ModelSelectorProps) {
    const [currentPrice, setCurrentPrice] = useState<number | null>(defaultPrice)

    const { pending } = useFormStatus()
    const { isSignedIn } = useAuth()
    const { push } = useRouter()

    const initOrder = () => {
        const product = getProductData()

        if (product === null) return

        const products = JSON.stringify({ products: [{ ...product, quantity: 1 }], total: currentPrice })
        push(`/order?data=${encodeURIComponent(products)}`);
    }

    const inStock = (prices.reduce((acc, count) => {
        const sku = JSON.parse(count.metadata["SKU"]) as { stock: number }
        return acc + Number(sku.stock)
    }, 0)) > 0

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
                                    <RadioGroupItem key={id} value={id} disabled={!inStock || Number(sku.stock) === 0}
                                        className="p-6 px-3 bg-accent rounded-2xl w-full flex justify-between gap-1 border data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-price={unit_amount}
                                        onClick={(e) => {
                                            onSetModel(id)
                                            const target = e.target as HTMLButtonElement
                                            if (target.tagName.toLowerCase() !== 'button') return

                                            setCurrentPrice(Number(target.getAttribute('data-price')))

                                        }}>
                                        <p className="-z-0 font-semibold">{nickname}</p>
                                        <p className="-z-0 text-sm opacity-80">{unit_amount && (unit_amount / 100).toLocaleString('it-IT', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })}</p>
                                    </RadioGroupItem>
                                )
                            })}
                        </RadioGroup>
                    </>
                }
            </div>
            <footer className="flex gap-3">
                {isSignedIn && <>
                    {inStock
                        ?
                        <>
                            <Button disabled={currentPrice === null || activeColor === null}
                                className="p-5 bg-primary text-primary-foreground w-full rounded-xl disabled:opacity-90 transition-opacity duration-500"
                                type="button"
                                onClick={initOrder}
                            >
                                {`Compra per ${currentPrice && (currentPrice / 100).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'EUR'
                                })}`}
                            </Button>
                            <Button disabled={currentPrice === null || activeColor === null || pending} variant={'outline'} className="w-[50px] h-max border grid place-content-center rounded-xl disabled:opacity-90 transition-opacity duration-500">
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