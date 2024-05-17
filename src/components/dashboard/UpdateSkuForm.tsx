'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { SKUProps } from "@/app/(admin)/dashboard/products/edit/[id]/content";
import { CircleNotch } from "@phosphor-icons/react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ReactNode, useState } from "react";
import Stripe from "stripe";
import { Button } from "../ui/button";

interface Props extends SKUProps {
    children: ReactNode
    onUpdateSku: (data: Stripe.Price) => void
}

export function UpdateSkuForm({ children, available_colors, priceId, stock, onUpdateSku }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [colors, setColors] = useState<{ name: string, code: string, available: boolean }[]>(available_colors)


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Editar informações do SKU</DialogTitle>
                </DialogHeader>
                <form className="grid gap-2" onSubmit={async (e) => {
                    e.preventDefault()
                    setIsLoading(true)

                    try {
                        const skuData = {
                            priceId,
                            stock: new FormData(e.target as HTMLFormElement).get("stock"),
                            available_colors: colors
                        }

                        const response = await fetch("/api/admin/products/sku", {
                            method: "POST",
                            body: JSON.stringify(skuData)
                        })

                        const data = await response.json()

                        return onUpdateSku(data)

                    } catch (err) {
                        console.log(err)
                    } finally {
                        setOpen(false)
                        return setIsLoading(false)

                    }
                }}>
                    <label className="text-sm grid gap-2" htmlFor="stock">
                        Stock
                        <Input defaultValue={stock} type="number" name="stock" />
                    </label>
                    <div className="grid gap-2">
                        {available_colors.map(({ name, code, available }) => (
                            <label key={name} className="flex items-center gap-2">
                                <Checkbox onClick={() => setColors((state) => {
                                    const index = state.findIndex(x => x.name === name)
                                    const updateColors = [...state]
                                    updateColors[index] = { name, code, available: available === true ? false : true }

                                    return updateColors
                                })}
                                    className="rounded-full size-7 shadow-inner shadow-black/50 border-2 data-[state=checked]:border-blue-400"
                                    style={{ background: code }} name={name} value={code} defaultChecked={available} />
                                {name}
                            </label>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="submit">
                            {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}