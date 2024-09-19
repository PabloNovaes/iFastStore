'use client'


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
import { Skeleton } from "@/components/ui/skeleton"
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
    const [products, setProducts] = useState<Product[] | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/admin/products", {
                next: {
                    tags: ['load-product']
                },
                cache: "no-store"
            })
            const data = await response.json()

            setProducts(data)
        }

        fetchData()
    }, [])

    const handleCreateProduct = (newProduct: Product) => setProducts((state) => [newProduct, ...(state ?? [])])
    const filteredProducts = filter === "all" ? products : products?.filter(product => product.active === filter)

    return (
        <main className="p-4 sm:px-6 flex flex-col">
            <div className="flex justify-between items-center w-full mb-4">
                <RadioGroup defaultValue="Ativo" className="flex items-center gap-2 flex-wrap">
                    <RadioGroupItem onClick={() => setFilter("all")} value="all" key="all" className="border px-4 text-xs bg-background shadow-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">Todos</RadioGroupItem>
                    {tabs.map(({ active, title }) => (
                        <RadioGroupItem key={title} onClick={() => setFilter(active)} value={title} className="border px-4 text-xs bg-background shadow-sm py-1 rounded-lg transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white">{title}</RadioGroupItem>
                    ))}
                </RadioGroup>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Produtos
                        <CreateProductForm onCreateNewProduct={handleCreateProduct}>
                            <Button size="icon" variant={"outline"} className="py-[5px] h-fit text-sm rounded-lg">
                                <PlusCircle size={18} />
                            </Button>
                        </CreateProductForm>
                    </CardTitle>
                    <CardDescription>
                        Gerencie seus produtos e visualize seu desempenho de vendas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100svh - 250px)" }}>
                    {products?.length !== 0 ? <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Imagem</span>
                                </TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead className="hidden md:table-cell">Total de vendas</TableHead>
                                <TableHead className="hidden md:table-cell">Criado em</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!products
                                ? Array.from({ length: 5 }).map((_, indx) => (
                                    <TableRow key={indx}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Skeleton className="my-3 w-20 h-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="my-3 w-40 h-5 rounded-md" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="my-3 x-w-20 w-full h-5 rounded-md" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="my-3 w-16 h-5 rounded-md" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="my-3 w-20 h-5 rounded-md" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="my-3 w-32 h-5 rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : filteredProducts?.map(({ id, name, created, images, active, default_price, sales, prices }) => {
                                    const price = default_price as Stripe.Price

                                    return (
                                        <TableRow key={id} onClick={() => router.push(`/dashboard/products/edit/${id}`)} className="cursor-pointer h-[53px]">
                                            <TableCell className="hidden sm:table-cell relative">
                                                {images.length === 0
                                                    ? <img
                                                        alt="product image"
                                                        className="aspect-square rounded-md w-fit py-1"
                                                        width={80}
                                                        height={80}
                                                        style={{ objectFit: 'contain', position: "initial" }}
                                                        src={"https://ifaststore.it/assets/icons/placeholder.png"}
                                                    />
                                                    :
                                                    <img
                                                        alt="product image"
                                                        className="aspect-square rounded-md w-fit py-1"
                                                        width={80}
                                                        height={80}
                                                        style={{ objectFit: 'contain', position: "initial" }}
                                                        src={images[0] as any}
                                                    />
                                                }
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p className="line-clamp-1">
                                                    {name}
                                                </p>
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
                                                            <Button variant={"outline"}>{`${prices.length} preços`}</Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Prices</DropdownMenuLabel>
                                                            {prices.sort((a, b) => {
                                                                const aPrice = a as Stripe.Price
                                                                const bPrice = b as Stripe.Price
                                                                return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
                                                            }).map(({ unit_amount, nickname, id }) => (
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
                        : <span>Nenhum produto encontrado</span>
                    }
                </CardContent>
            </Card>
        </main>
    )
}
