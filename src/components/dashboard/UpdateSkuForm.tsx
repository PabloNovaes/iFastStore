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
import { Spinner } from "@phosphor-icons/react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Stripe from "stripe";
import { Button } from "../ui/button";

interface Props extends SKUProps {
    onUpdateSku: (data: Stripe.Price) => void;
    productId: string;
    productCategory: string;
}

export function UpdateSkuForm({ available_colors, priceId, stock, onUpdateSku, productCategory }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [colors, setColors] = useState<{ name: string, code: string, available: boolean }[]>(available_colors)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const skuData = {
                priceId,
                stock: new FormData(event.target as HTMLFormElement).get("stock"),
                available_colors: colors
            }

            const response = await fetch("/api/admin/products/sku", {
                method: "POST",
                body: JSON.stringify(skuData)
            })

            const data = await response.json()

            return onUpdateSku(data)

        } catch (err) {
            toast.error("si è verificato un errore imprevisto!")
            throw err
        } finally {
            setOpen(false)
            return setIsLoading(false)

        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="absolute left-0 top-0 w-full h-full"></DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Editar informações do SKU</DialogTitle>
                </DialogHeader>
                <form className="grid gap-2" onSubmit={handleSubmit}>

                    <div className="grid gap-2 grid-cols-3 items-end">
                        <label className="text-sm grid gap-2 col-span-2" htmlFor="stock">
                            Estoque
                            <Input defaultValue={stock} type="number" name="stock" />
                        </label>
                        <Button variant={"secondary"} type="button">
                            <a target="_blank" href={`https://dashboard.stripe.com/prices/${priceId}`}>Editar Preço</a>
                        </Button>
                    </div>

                    {productCategory !== "software" && (
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

                    )}
                    <DialogFooter>
                        <Button type="submit">
                            {isLoading ? <Spinner size={22} className="animate-spin" /> : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}