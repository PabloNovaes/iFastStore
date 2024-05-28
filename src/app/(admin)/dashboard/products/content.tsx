'use client'

import Image from "next/image"

import { CreateProductForm } from "@/components/dashboard/CreateProductForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PlusCircle } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Stripe from "stripe"

const tabs: {
    active: boolean, title: string
}[] = [
        { active: true, title: "Ativo" },
        { active: false, title: "Arquivado" },
    ]

export interface Product extends Omit<Stripe.Product, "images"> {
    prices: Stripe.Price[]
    images: { name: string, url: string }[]
    sales: number
}
export function Products() {
    const [filter, setFilter] = useState<string | boolean>(true)
    const [products, setProducts] = useState<Product[]>([])

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/admin/products")
            const data = await response.json()

            setProducts(data)
        }

        fetchData()
    }, [])

    if (products.length === 0) return

    const handleCreateProduct = (newProduct: Product) => setProducts((state) => [newProduct, ...state])

    const filteredProducts = filter === "all" ? products : products.filter(product => product.active === filter)

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="flex justify-between items-center w-full mb-4">
                <RadioGroup defaultValue="Ativo" className="flex items-center gap-2 flex-wrap">
                    <RadioGroupItem onClick={() => setFilter("all")} value="all" key="all" className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">Todos</RadioGroupItem>
                    {tabs.map(({ active, title }) => (
                        <RadioGroupItem key={title} onClick={() => setFilter(active)} value={title} className="border px-4 text-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">{title}</RadioGroupItem>
                    ))}
                </RadioGroup>
                <CreateProductForm onCreateNewProduct={handleCreateProduct}>
                    <Button className="py-[5px] h-fit text-sm rounded-lg">
                        <PlusCircle size="icon" className="size-5 mr-1" />
                        Adicionar
                    </Button>
                </CreateProductForm>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Produtos</CardTitle>
                    <CardDescription>
                        Gerencie seus produtos e visualize seu desempenho de vendas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto" style={{maxHeight: "calc(100dvh - 240px)"}}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Imagem</span>
                                </TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Total de vendas
                                </TableHead>
                                <TableHead className="hidden md:table-cell">Criado em</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map(({ id, name, created, images, active, default_price, sales, prices }) => {
                                const price = default_price as Stripe.Price
                                return (
                                    <TableRow key={id} onClick={() => router.push(`/dashboard/products/edit/${id}`)} className="cursor-pointer h-[53px]">
                                        <TableCell className="hidden sm:table-cell relative">
                                            {images.length === 0
                                                ? <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md w-fit py-1"
                                                    style={{ objectFit: 'contain' }}
                                                    layout="fill"
                                                    src={'/assets/icons/placeholder.png'}
                                                />
                                                :
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md w-fit py-1"
                                                    style={{ objectFit: 'contain' }}
                                                    layout="fill"
                                                    src={images[0] as any}
                                                />
                                            }
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={active ? "green" : "warning"}>{tabs.filter(tab => tab.active === active)[0].title}</Badge>
                                        </TableCell>
                                        {prices.length === 1
                                            ? <TableCell>
                                                {price && price.unit_amount ? (
                                                    (price.unit_amount / 100)?.toLocaleString("it-IT", {
                                                        style: "currency",
                                                        currency: "EUR"
                                                    }))
                                                    : 0
                                                }
                                            </TableCell>

                                            : <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"outline"}>
                                                            {`${prices.length} preços`}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Prices</DropdownMenuLabel>
                                                        {prices.sort((a, b) => {
                                                            const aPrice = a as Stripe.Price
                                                            const bPrice = b as Stripe.Price

                                                            return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
                                                        })
                                                            .map(({ unit_amount, nickname, id }) => (
                                                                <DropdownMenuItem key={id}>
                                                                    {
                                                                        `${unit_amount && ((unit_amount / 100)?.toLocaleString("it-IT", { style: "currency", currency: "EUR" }))} - ${nickname}`
                                                                    }
                                                                </DropdownMenuItem>

                                                            ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        }
                                        <TableCell className="hidden md:table-cell">{sales}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(created * 1000).toLocaleString("pt-BR")}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}