'use client'

import { addNewProductColors } from "@/app/actions";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { CircleNotch } from "@phosphor-icons/react";
import { ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import Stripe from "stripe";
import { Button } from "../ui/button";
import { colorOptions } from "./CreateProductForm";

interface Props {
    children: ReactNode;
    colors: { name: string, code: string }[];
    id: string;
    onUpdateColors: ({ colors, updatedPrices }: { colors: { name: string, code: string }[], updatedPrices: Stripe.Price[] }) => void
}

export function UpdateProductColorsModal({ children, colors, id, onUpdateColors }: Props) {
    const [value, setValue] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const closeModalRef = useRef<HTMLButtonElement>(null)

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Adicionar cores ao produto</DialogTitle>
                </DialogHeader>
                <form className="grid gap-2" onSubmit={async (e) => {
                    e.preventDefault()
                    setIsLoading(true)
                    try {
                        const res = await addNewProductColors({ id, colors: [...colors, ...colorOptions.filter(color => value.some(data => data === color.name))] })
                        onUpdateColors(res)
                        if (closeModalRef.current) {
                            return closeModalRef.current?.click()
                        }

                    } catch (err) {
                        toast.error("Ocorreu um erro inesperado!")
                        throw err
                    } finally {
                        setIsLoading(false)
                    }
                }}>
                    <div className="text-sm">
                        Cores do produto
                        <MultiSelector id="colors" values={value} onValuesChange={setValue} loop={false}>
                            <MultiSelectorTrigger>
                                <MultiSelectorInput placeholder="Selecione as cores do produto" />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent>
                                <MultiSelectorList>
                                    {colorOptions
                                        .filter(color => !colors.some(removeColor => removeColor.code === color.code))
                                        .map((option, i) => {
                                            return (
                                                <MultiSelectorItem key={i} value={option.name}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full size-6 shadow-inner shadow-black/50 border-2" style={{ background: option.code }}></span>
                                                        {option.name}
                                                    </div>
                                                </MultiSelectorItem>
                                            )
                                        })}
                                </MultiSelectorList>
                            </MultiSelectorContent>
                        </MultiSelector>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
                <DialogClose ref={closeModalRef} />
            </DialogContent>
        </Dialog>
    )
}