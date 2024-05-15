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
import { ReactNode, useRef, useState } from "react";
import { Button } from "../ui/button";

import { Product } from "@/app/(admin)/dashboard/products/content";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const options = [
    { name: 'Titanio Nature', code: '#bab4a9' },
    { name: 'Titanio Blu', code: '#3d4555' },
    { name: 'Titanio Bianco', code: '#f2f1eb' },
    { name: 'Titanio Nero', code: '#3f4042' },
    { name: 'Bianco', code: '#ffffff' },
    { name: 'Nero', code: '#000000' }
]

export function CreateProductForm({ children, onCreateNewProduct }: { children: ReactNode, onCreateNewProduct: (data: Product) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string[]>([]);

    const formRef = useRef(null)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Criar novo produto</DialogTitle>
                </DialogHeader>
                <form
                    className="grid gap-2"
                    ref={formRef}
                    onSubmit={async (event) => {
                        event.preventDefault();
                        setIsLoading(true);

                        try {
                            if (formRef.current === null) return;

                            const formData = new FormData((formRef.current as HTMLFormElement));

                            const data = {
                                name: formData.get("name"),
                                stock: Number(formData.get("stock")),
                                price: Number(formData.get("price")),
                                nickname: formData.get("nickname"),
                                category: formData.get("category"),
                                colors: value.map((current) => {
                                    const { name, code } = options.filter(
                                        (option) => option.name === current
                                    )[0];
                                    return { name: name.toLowerCase(), code };
                                }),
                            };

                            const response = await fetch("/api/admin/products", {
                                method: "POST",
                                body: JSON.stringify(data)
                            })

                            const res = await response.json()

                            onCreateNewProduct(res)
                            return toast.success("Produto criado com sucesso!")
                        } catch (err) {
                            toast.error("Ocorreu um erro inesperado!")
                            throw err
                        } finally {
                            setOpen(false);
                            setIsLoading(false);
                        }
                    }}
                >

                    <label className="text-sm grid gap-2" htmlFor="name">
                        Nome
                        <Input type="text" name="name" placeholder="Nome do produto" />
                    </label>
                    <div className="grid grid-cols-3 gap-2 items-end">
                        <label className="text-sm grid gap-2 col-span-2" htmlFor="price">
                            Preço
                            <Input type="number" name="price" placeholder="Preço do produto" />
                        </label>
                        <label className="text-sm" htmlFor="nickname">
                            <Select name="nickname">
                                <SelectTrigger id="nickname" aria-label="Select category">
                                    <SelectValue placeholder="Identificador" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Padrão">Padrão</SelectItem>
                                    <SelectItem value="128 GB">128 GB</SelectItem>
                                    <SelectItem value="256 GB">256 GB</SelectItem>
                                    <SelectItem value="512 GB">512 GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm grid gap-2" htmlFor="category">
                            Categoria do produto
                            <Select name="category">
                                <SelectTrigger id="category" aria-label="Select category">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="iphone">iPhone</SelectItem>
                                    <SelectItem value="airpods">AirPods</SelectItem>
                                    <SelectItem value="notebooks">Notebooks</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className="text-sm grid gap-2" htmlFor="name">
                            Estoque
                            <Input type="number" name="stock" placeholder="Estoque inicial" />
                        </label>
                    </div>

                    <div className="text-sm">
                        Cores do produto
                        <MultiSelector values={value} onValuesChange={setValue} loop={false}>
                            <MultiSelectorTrigger>
                                <MultiSelectorInput placeholder="Selecione as cores do produto" />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent>
                                <MultiSelectorList>
                                    {options.map((option, i) => (
                                        <MultiSelectorItem key={i} value={option.name}>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full size-6 shadow-inner shadow-black/50 border-2" style={{ background: option.code }}></span>
                                                {option.name}
                                            </div>
                                        </MultiSelectorItem>
                                    ))}
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
            </DialogContent>
        </Dialog>
    )
}