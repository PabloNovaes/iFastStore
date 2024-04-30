import { CartProduct } from "@/app/cart/page";
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
}

export function ProductModelSelector({ prices, defaultPrice, getProductData }: ModelSelectorProps) {
    const [selected, setSelected] = useState(false)
    const [currentPrice, setCurrentPrice] = useState<number | null>(defaultPrice)

    const { pending } = useFormStatus()
    const { isSignedIn } = useAuth()
    const { push } = useRouter()

    const initOrder = () => {
        const product = getProductData()
        const products = JSON.stringify({ products: [{ ...product, quantity: 1 }], total: currentPrice })
        push(`/order?data=${encodeURIComponent(products)}`);
    }

    return (
        <>
            <div className="grid gap-4">
                {prices.length > 1 &&
                    <>
                        <h2 className="font-semibold">Prezzi:</h2>
                        <RadioGroup className="model-selector flex flex-col gap-2 items-center" name="price_id">
                            {prices.map(({ id, nickname, unit_amount }) => (
                                <RadioGroupItem key={id} value={id}
                                    className="p-6 px-3 bg-accent rounded-2xl w-full flex justify-between gap-1 border data-[state=checked]:border-blue-400 transition-all" data-price={unit_amount}
                                    onClick={(e) => {
                                        setSelected(true)
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
                            ))}
                        </RadioGroup>
                    </>
                }
            </div>
            <footer className="flex gap-3">
                {isSignedIn
                    ?
                    <>
                        <Button disabled={!selected && prices.length > 1}
                            className="p-5 bg-primary text-primary-foreground w-full rounded-xl disabled:opacity-90 transition-opacity duration-500"
                            type="button"
                            onClick={initOrder}
                        >
                            {`Comprar por ${currentPrice && (currentPrice / 100).toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'EUR'
                            })}`}
                        </Button>
                        <Button disabled={!selected && prices.length > 1 || pending} variant={'outline'} className="w-[50px] h-max border grid place-content-center rounded-xl disabled:opacity-90 transition-opacity duration-500">
                            {pending
                                ? <CircleNotch size={22} className="animate-spin" />
                                : <ShoppingCart size={22} />
                            }
                        </Button>
                    </>
                    :
                    <Button variant={'secondary'} className="py-5 w-full rounded-xl">
                        Devi essere autenticato per acquistare!
                    </Button>
                }
            </footer>
        </>
    )
}