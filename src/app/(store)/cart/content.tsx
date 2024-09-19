'use client'

import { ShoppingCartCard } from "@/components/ShoppingCartCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import { SmileySad } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Stripe from "stripe";

export interface CartProduct {
    productId: string
    priceId: string
    image: string
    name: string
    color: string
    userId: string | null | undefined
    id?: string
    price: Stripe.Price
    quantity?: number
    shipping_tax: number
    category?: string
}
export function ShoppingCart() {
    const [products, setProducts] = useState<CartProduct[] | string>([])
    const [selectedProducts, setSelectedProducts] = useState<CartProduct[]>([])
    const [selectDeleteProduct, setSelectDeleteProduct] = useState<CartProduct | null>(null)
    const { isSignedIn, userId } = useAuth()


    useEffect(() => {
        const fetchData = async () => {
            if (!isSignedIn) return

            const response = await fetch(`/api/cart?userId=${userId}`, {
                cache: 'no-store',
                next: {
                    tags: ['cart-request'],
                }
            })

            const data = await response.json() as CartProduct[] | string
            setProducts(data)
        }

        fetchData()
    }, [isSignedIn, userId])

    useEffect(() => {

        const fetchData = async () => {
            if (selectDeleteProduct === null) return

            try {
                await fetch(`/api/cart/remove`, {
                    method: 'DELETE',
                    body: JSON.stringify(selectDeleteProduct),
                })

                const newProductsValue = (products as CartProduct[])
                    .filter(x => x.productId !== selectDeleteProduct.productId)
                    .map((product) => {
                        const currentIndex = selectedProducts.findIndex(x => x.id === product.id)
                        const { quantity } = selectedProducts[currentIndex]
                        product.quantity = quantity
                        return product
                    })

                toast.success("Prodotto rimosso dal carrello!")

                if (newProductsValue.length === 0) {
                    setProducts('your shopping cart is empty')
                    setSelectedProducts(newProductsValue)
                    setSelectDeleteProduct(null)
                    return
                }

                setProducts(newProductsValue)
                setSelectedProducts(newProductsValue)
                setSelectDeleteProduct(null)
            } catch (error) {
                return toast.error("Si è verificato un errore imprevisto")
            }
        }

        fetchData()
    }, [products, selectDeleteProduct, selectedProducts])

    const handleSelectProducts = (product: CartProduct) => {
        setSelectedProducts((state) => [...state, product])
    }

    const handleUnselectProduct = (productId: string) => {
        setSelectedProducts((state) => [...state.filter(x => x.productId !== productId)])
    }

    const handleRemoveProduct = (product: CartProduct) => {
        setSelectDeleteProduct(product)
    }

    const handleModifyQuantity = (productId: string, newQuantity: number) => {
        const modifyQuantity = selectedProducts.map(product => {
            if (product.productId === productId) {
                product.quantity = newQuantity
            }
            return product
        })
        setSelectedProducts(modifyQuantity)
    }

    const subtotal = () => {
        const prices = selectedProducts.map(product => Number(product.price && product.price.unit_amount) * Number(product.quantity))
        const total = prices.reduce((acc, price) => {
            return (acc as number) + (price as number)
        }, 0)

        return (total as number)
    }

    const { push } = useRouter()

    const initOrder = () => {
        const products = JSON.stringify({ products: selectedProducts, total: subtotal() })
        push(`/order?data=${encodeURIComponent(products)}`);
    }

    if (!isSignedIn) return (
        <div className="flex items-center opacity-80 justify-center gap-4 flex-col" style={{ minHeight: 'calc(100svh - 80px)' }}>
            <SmileySad size={60} />
            <p className="font-medium text-2xl text-center">Oops...sembra che tu non sia autenticato</p>
        </div>
    )

    return (
        <main className="p-5 flex gap-6 max-w-2xl m-auto justify-center" style={{ height: 'calc(100svh - 50px)' }}>
            <div className="max-w-4xl w-full grid" style={{ gridTemplateRows: 'min-content 1fr min-content' }}>
                <header className="py-2 font-semibold text-md">Carrelo</header>
                <div className="w-full max-h-[70svh] overflow-auto gap-5 flex flex-col">
                    {(products as CartProduct[]).length !== 0 && typeof products !== 'string' &&
                        (products as CartProduct[]).map((props: CartProduct) => (
                            <ShoppingCartCard key={props.productId} {...props}
                                modifyQuantity={handleModifyQuantity} unselectProduct={handleUnselectProduct}
                                selectProduct={handleSelectProducts} selectRemoveProduct={handleRemoveProduct} />
                        ))
                    }

                    {(products as CartProduct[]).length === 0 && Array.from({ length: 2 }).map(() => (
                        <>
                            <div key={Math.random()} className="flex gap-4 items-center h-fit">
                                <Skeleton className="rounded-[20px] size-28" />
                                <div className="grid pl-3 h-[104px]">
                                    <Skeleton className="rounded-md w-44 h-6" />
                                    <Skeleton className="rounded-md w-24 h-5" />
                                    <Skeleton className="rounded-md w-20 h-5" />
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <footer className="grid gap-3">
                    {
                        typeof products !== "string"
                            ?
                            <>
                                <span className="flex justify-between items-center">
                                    <p>Total</p>
                                    <p>{
                                        (subtotal() / 100).toLocaleString('it-IT', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        })
                                    }</p>
                                </span>
                                <Button disabled={selectedProducts.length <= 0} onClick={initOrder} className="disabled:opacity-90 transition-opacity duration-500">Continua</Button>
                            </>
                            : <Button className="p-3 rounded-lg w-full flex gap-1" variant={'secondary'}>
                                Il tuo carrello è vuoto<SmileySad weight="fill" size={18} />
                            </Button>
                    }
                </footer>
            </div>
        </main >
    )
}