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
import { Textarea } from "../ui/textarea";


export const colorOptions = [
    { name: 'Titanio Naturale', code: '#bab4a9' },
    { name: 'Titanio Blu', code: '#3d4555' },
    { name: 'Titanio Bianco', code: '#f2f1eb' },
    { name: 'Titanio Nero', code: '#3f4042' },
    { name: 'Bianco', code: '#ffffff' },
    { name: 'Nero', code: '#000000' },
    { name: 'Verde Mezzanotte', code: '#495a48' },
    { name: 'Rosso', code: '#c82333' },
    { name: 'Rosa chiaro', code: '#fbe2dd' },
    { name: 'Blu Cobalto', code: '#437691' },
    { name: 'Azzurro', code: '#aabbcd' },
    { name: 'Viola', code: '#e5ddea' },
    { name: 'Giallo', code: '#fff49b' },
    { name: 'Verde Alpino', code: '#d0dbcb' },
    { name: 'Blu Polvere', code: '#d5dde0' },
    { name: 'Giallo Pallido', code: '#ede8ca' },
    { name: 'Mezzanotte', code: '#2e3641' },
    { name: 'Galassia', code: '#f0e5d3' },
    { name: 'Grigio Siderale', code: '#7d7e80' },
    { name: 'Argento', code: '#e3e4e6' },
    { name: 'Nero Siderale', code: '#2e2c2f' },
    { name: 'Blu Acciaio', code: '#8698a8' },
    { name: 'Verde Salvia', code: '#a4bdb4' },
    { name: 'Rosa Sabbia', code: '#ecb8ac' },
    // Novas cores do iPhone 16
    { name: 'Blu oltremare', code: '#9eb1f6' },
    { name: 'Verde Acqua', code: '#b4d6d5' },
    { name: 'Rosa', code: '#f3b2dc' },
    // Novas cores do iPhone 16 pro
    { name: 'Titanio Sabbia', code: '#c4ab97' },
];
export function CreateProductForm({ children, onCreateNewProduct }: { children: ReactNode, onCreateNewProduct: (data: Product) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string[]>([]);
    const [category, setCategory] = useState("")

    const createProduct = async (event: FormEvent<HTMLFormElement>) => {
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
                description: formData.get("description"),
                colors: value.map((current) => {
                    const { name, code } = colorOptions.filter(
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
    }

    const formRef = useRef(null)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Criar novo produto</DialogTitle>
                </DialogHeader>
                <form
                    className="grid gap-2"
                    ref={formRef}
                    onSubmit={createProduct}>
                    <label className="text-sm grid gap-2" htmlFor="name">
                        Nome
                        <Input required type="text" name="name" placeholder="Nome do produto" />
                    </label>
                    <div className="grid grid-cols-3 gap-2 items-end">
                        <label className="text-sm grid gap-2 col-span-2" htmlFor="price">
                            Preço
                            <Input required type="number" name="price" placeholder="Preço do produto" />
                        </label>
                        <label className="text-sm" htmlFor="nickname">
                            <Select required name="nickname" defaultValue="Padrão">
                                <SelectTrigger id="nickname">
                                    <SelectValue placeholder="Identificador" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={"Padrão"} value="Padrão">Padrão</SelectItem>
                                    <SelectItem key={"64 GB"} value="64 GB">64 GB</SelectItem>
                                    <SelectItem key={"128 GB"} value="128 GB">128 GB</SelectItem>
                                    <SelectItem key={"256 GB"} value="256 GB">256 GB</SelectItem>
                                    <SelectItem key={"512 GB"} value="512 GB">512 GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <label className="text-sm grid gap-2" htmlFor="category">
                            Categoria do produto
                            <Select required name="category" onValueChange={(value) => setCategory(value)}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={"iphone"} value="iphone">iPhone</SelectItem>
                                    <SelectItem key={"headphone"} value="airpod">Fones de ouvido</SelectItem>
                                    <SelectItem key={"notebook"} value="notebook">Notebooks</SelectItem>
                                    <SelectItem key={"software"} value="software">Software</SelectItem>
                                    <SelectItem key={"accessories"} value="accessories">Acessorios</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className="text-sm grid gap-2" htmlFor="name">
                            Estoque
                            <Input required type="number" name="stock" placeholder="Estoque inicial" />
                        </label>
                    </div>

                    {category !== "software" && <div className="text-sm">
                        Cores do produto
                        <MultiSelector values={value} onValuesChange={setValue} loop={false}>
                            <MultiSelectorTrigger>
                                <MultiSelectorInput placeholder="Selecione as cores do produto" />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent>
                                <MultiSelectorList>
                                    {colorOptions.map((option, i) => (
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
                    </div>}
                    <label className="text-sm grid gap-2" htmlFor="description">
                        Descrição (opcional)
                        <Textarea name="description" placeholder="Descrição do produto" />
                    </label>

                    <DialogFooter>
                        <Button type="submit">
                            {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}