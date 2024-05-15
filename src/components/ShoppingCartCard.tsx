'use client'

import { Minus, Plus } from "@phosphor-icons/react"
import Image from "next/image"
import { useRef, useState } from "react"
import { CartProduct } from "../app/(store)/cart/content"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

interface Props extends CartProduct {
    selectProduct: (product: CartProduct) => void;
    selectRemoveProduct: (product: CartProduct) => void;
    unselectProduct: (productId: string) => void;
    modifyQuantity: (productId: string, newQuantity: number) => void;
}

export function ShoppingCartCard(product: Props) {
    const [quantity, setQuantity] = useState(1)
    const [disabled, setDisabled] = useState(true)
    const { image, name, color, price, priceId, productId, id, userId, selectProduct, modifyQuantity, unselectProduct, selectRemoveProduct, shipping_tax } = product
    const { nickname } = price
    const checkRef = useRef(null)

    const quantityControll = {
        increment() {
            setQuantity((state) => {
                modifyQuantity(productId, state + 1)
                return state + 1
            })
        },
        decrement() {
            if (quantity === 1) {
                const checkbox = checkRef.current ? checkRef.current as HTMLButtonElement : checkRef.current as null
                if (checkbox) checkbox.click()
                return selectRemoveProduct({ productId, name, image, color, price, priceId, userId, quantity, id, shipping_tax })
            }
            setQuantity((state) => {
                modifyQuantity(productId, state - 1)
                return state - 1
            })
            modifyQuantity(productId, quantity)
        },
    }


    return (
        <div key={productId} className="w-full overflow-hidden flex gap-4 h-fit items-center relative">
            <Checkbox id={productId} ref={checkRef} className="absolute right-0 m-auto" onClick={(e) => {
                const target = e.target as HTMLInputElement

                if (target.getAttribute('data-state') === 'checked') {
                    setDisabled(true)
                    setQuantity(1)
                    return unselectProduct(productId)
                }
                setDisabled(false)
                selectProduct({ productId, name, image, color, price, priceId, userId, quantity, id, shipping_tax })
            }} />
            <div className="bg-accent rounded-[20px] aspect-square size-32 relative">
                <Image src={image}
                    priority quality={100}
                    layout="fill"
                    alt="product image" className="w-full p-2" style={{ objectFit: 'contain' }} />
            </div>
            <div className="grid pl-3 gap-2">
                <header className="font-semibold py-2">
                    <p>{nickname ? `${name} - ${nickname}` : name}</p>
                    <span className="flex gap-1 w-full justify-start pb-3 text-sm">
                        <p>Colore:</p>
                        <p className="font-normal opacity-80">{color}</p>
                    </span>
                </header>
                <span className="text-sm" data-price={priceId}>{price.unit_amount && (price.unit_amount / 100).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'EUR'
                })}
                </span>
                <div className="flex gap-2 items-center">
                    <Button disabled={disabled} onClick={() => {
                        quantityControll.decrement()
                    }} variant={'secondary'} className="p-1 rounded-full h-fit border">
                        <Minus size={14} />
                    </Button>
                    <p>{quantity}</p>
                    <Button disabled={disabled} onClick={() => {
                        quantityControll.increment()
                    }} variant={'secondary'} className="p-1 rounded-full h-fit border">
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
        </div>
    )
}