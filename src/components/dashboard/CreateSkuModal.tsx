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

import { CircleNotch } from "@phosphor-icons/react";
import { FormEvent, ReactNode, useRef, useState } from "react";
import { Button } from "../ui/button";

import { CreateSkuProps, createNewSku } from "@/app/actions";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { SelectTrigger as PrimitiveTrigger } from "@radix-ui/react-select";
import { toast } from "sonner";
import Stripe from "stripe";
import { Select, SelectContent, SelectItem } from "../ui/select";

interface Props {
    children: ReactNode,
    productData: {
        id: string
        colors: { name: string, code: string }[]
    }
    onUpdateCreateNewSku: (data: Stripe.Price) => void
}

export function CreateSkuModal({ children, onUpdateCreateNewSku, productData }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const inputRef = useRef(null)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Criar nova variação</DialogTitle>
                </DialogHeader>
                <form
                    className="grid gap-2"
                    onSubmit={async (event: FormEvent) => {
                        event.preventDefault();
                        setIsLoading(true);

                        try {
                            const form = event.target as HTMLFormElement
                            const formData = Object.fromEntries(new FormData(form).entries())

                            const { id, colors } = productData

                            const data = await createNewSku({
                                ...formData, colors, id
                            } as CreateSkuProps)

                            return onUpdateCreateNewSku(data)

                        } catch (err) {
                            toast.error("Si è verificato un errore imprevisto!")
                            throw err
                        } finally {
                            setOpen(false);
                            setIsLoading(false);
                        }
                    }}>
                    <div className="grid grid-cols-3 gap-2 items-end">
                        <label className="text-sm grid gap-2 col-span-2" htmlFor="price">
                            Preço
                            <Input type="number" name="price" placeholder="Preço do produto" />
                        </label>
                        <label className="text-sm grid gap-2" htmlFor="name">
                            Estoque
                            <Input type="number" name="stock" placeholder="Estoque inicial" />
                        </label>
                        <label className="text-sm flex gap-2" style={{ gridColumn: "1/4" }}>
                            <Input ref={inputRef} type="text" name="identifier" placeholder="Crie um identificador ou use um pronto" />
                            <Select onValueChange={(value) => {
                                if (inputRef.current === null) return
                                (inputRef.current as HTMLInputElement).value = value
                            }}>
                                <PrimitiveTrigger id="identifier" aria-label="Select category">
                                    <Button variant="outline" className="p-2">
                                        <ChevronDownIcon />
                                    </Button>
                                </PrimitiveTrigger>
                                <SelectContent>
                                    <SelectItem value="128 GB">128 GB</SelectItem>
                                    <SelectItem value="256 GB">256 GB</SelectItem>
                                    <SelectItem value="512 GB">512 GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
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