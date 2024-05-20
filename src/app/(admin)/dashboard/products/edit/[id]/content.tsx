'use client'

import Stripe from "stripe";

import { CaretLeft, PencilSimple, PlusCircle, Upload } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Product } from "../../content";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { changeProductCategory, changeProductStatus, upadteShippingTax } from "@/app/actions";
import { CreateSkuModal } from "@/components/dashboard/CreateSkuModal";
import { DeleteProductImageModal } from "@/components/dashboard/DeleteProductImageModal";
import { UpdateSkuForm } from "@/components/dashboard/UpdateSkuForm";
import { UploadImage } from "@/components/dashboard/UploadImage";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Params {
    params: {
        id: string
    }
}

export interface SKUProps {
    priceId: string
    unit_amount: number
    stock: number
    nickname: string
    available_colors: { name: string, code: string, available: boolean }[]
}

export function ProductDetails({ params }: Params) {
    const [product, setProduct] = useState<Product>()
    const [images, setImages] = useState<{ name: string, url: string }[]>([])
    const [Skus, setSkus] = useState<SKUProps[]>([])

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/products/find?id=${params.id}`)
            const data = await response.json() as Product

            const responseImages = data.images as any

            setProduct(data)
            setImages(responseImages as { name: string, url: string }[])

            const SkusData: SKUProps[] = data.prices
                .sort((a, b) => {
                    const aPrice = a as Stripe.Price
                    const bPrice = b as Stripe.Price

                    return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
                })
                .map(({ unit_amount, id, metadata, nickname }) => ({ priceId: id, unit_amount, ...JSON.parse(metadata["SKU"]), nickname }))

            return setSkus(SkusData)
        }

        fetchData()

    }, [params])

    const handleUpdatedSku = (data: Stripe.Price) => {
        setSkus((state) => {
            const index = state.findIndex(x => x.priceId === data.id)
            const updatedState = [...state]

            updatedState[index] = { priceId: data.id, unit_amount: data.unit_amount, ...JSON.parse(data.metadata["SKU"]), nickname: data.nickname }
            return updatedState
        })
    }

    const handleCreateNewSku = (data: Stripe.Price) => {
        if (data === null) return

        const { unit_amount, id, nickname, metadata } = data

        const { available_colors, stock } = JSON.parse(metadata["SKU"]) as SKUProps
        const newSku = { priceId: id as string, unit_amount: unit_amount as number, nickname: nickname as string, stock: stock as number, available_colors: available_colors }

        setSkus((state) => [...state, { ...newSku }])
    }

    const onUploadImages = (data: { name: string, url: string }[]) => setImages((state) => [...state, ...data])

    const handleDeleteImage = (fileName: string) => setImages((state) => [...state.filter(image => image.name !== fileName)])

    if (!product) return

    const colors = JSON.parse(product.metadata["colors"]) as { name: string, code: string }[]
    const stockCount = Skus.reduce((acc, count) => { return acc + count.stock }, 0)
    const thumbIndex = images.findIndex(image => image.name.includes("thumb"))
    const shipping_tax = product.metadata["shipping_tax"]

    return (
        <main className="p-4 sm:px-6 flex flex-col max-w-[64rem] w-full m-auto gap-4">
            <header className="flex items-center gap-4">
                <Button variant={"outline"} className="p-1 h-fit" onClick={() => router.replace('/dashboard/products')}>
                    <CaretLeft weight="bold" size={14} />
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">{product.name}</h1>
                <Badge variant={stockCount > 0 ? "green" : "warning"} className="h-fit">{stockCount > 0 ? "Em estoque" : "Sem estoque"}</Badge>
            </header>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 h-full">
                <div className="flex flex-col gap-4 md:gap-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do produto</CardTitle>
                            <CardDescription>Todos os detalhes do produto</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <label className="font-medium text-sm">
                                Nome<Input name="name" defaultValue={product.name} className="mt-1" placeholder="Nome do produto" />
                            </label>
                            <div className="grid gap-4 grid-cols-3">
                                <div className="grid gap-3">
                                    <label className="font-medium text-sm" htmlFor="category">Categoria</label>
                                    <Select onValueChange={async (value) => {
                                        const metadata = product.metadata
                                        metadata['category'] = value

                                        await changeProductCategory({ id: product.id, data: metadata })
                                    }}>
                                        <SelectTrigger id="category" aria-label="Select category">
                                            <SelectValue placeholder={product.metadata['category']} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="iphone">iPhone</SelectItem>
                                            <SelectItem value="airpod">AirPods</SelectItem>
                                            <SelectItem value="notebook">Notebooks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3">
                                    <label className="font-medium text-sm" htmlFor="status">Status</label>
                                    <Select onValueChange={async (value: string) => {
                                        let status

                                        if (value === "true") status = true
                                        if (value === "false") status = false

                                        await changeProductStatus({ id: (product.id as string), active: Boolean(status) })
                                    }}>
                                        <SelectTrigger id="status" aria-label="Select status">
                                            <SelectValue placeholder={product.active === true ? "Ativo" : "Arquivado"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"true"}>Ativo</SelectItem>
                                            <SelectItem value={"false"}>Arquivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <label className="font-medium text-sm" htmlFor="status">Taxa de envio</label>
                                    <Select onValueChange={async (value: string) => (await upadteShippingTax({ id: product.id, value: Number(value) }))}>
                                        <SelectTrigger id="status" aria-label="Select status">
                                            <SelectValue placeholder={
                                                Number(shipping_tax) === 0 ? "Free" : (Number(shipping_tax) / 100).toLocaleString("it-IT", { style: "currency", currency: "eur" })} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"0"}>Free</SelectItem>
                                            <SelectItem value={"1499"}>{(1499 / 100).toLocaleString("it-IT", { style: "currency", currency: "eur" })}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estoque</CardTitle>
                            <CardDescription>
                                Detalhes do estoque e variações dos produtos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">SKU</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Cores disponveis</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Skus.map((sku) => {
                                        const { unit_amount, priceId, stock, available_colors, nickname } = sku
                                        const availableCount = available_colors.filter(color => color.available).length
                                        return (
                                            <TableRow key={priceId}>
                                                <TableCell className="font-semibold">{nickname}</TableCell>
                                                <TableCell>
                                                    {stock}
                                                </TableCell>
                                                <TableCell>
                                                    {(unit_amount / 100).toFixed(2)}
                                                </TableCell>
                                                <TableCell id="colors">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant={"outline"} className="min-w-[84px]">
                                                                {availableCount === 1 && "1 cor"}
                                                                {availableCount === 0 && "Nenhuma cor"}
                                                                {availableCount > 1 && `${availableCount} cores`}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Cores</DropdownMenuLabel>
                                                            {available_colors.map(({ name, code, available }) => {
                                                                if (!available) return

                                                                return (
                                                                    <DropdownMenuItem key={name} className="flex gap-2">
                                                                        <div className="rounded-full size-7 shadow-inner shadow-black/50 border-2"
                                                                            style={{ background: code }}>
                                                                        </div>
                                                                        <p>{name}</p>
                                                                    </DropdownMenuItem>
                                                                )
                                                            })}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell>
                                                    <UpdateSkuForm {...sku} onUpdateSku={handleUpdatedSku}>
                                                        <Button variant={"outline"} className="p-1 h-fit">
                                                            <PencilSimple className="opacity-80" size={16} />
                                                        </Button>
                                                    </UpdateSkuForm>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="justify-center border-t p-4">
                            <CreateSkuModal onUpdateCreateNewSku={handleCreateNewSku} productData={{ id: product.id, colors }}>
                                <Button size="sm" variant="ghost" className="gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    Adicionar
                                </Button>
                            </CreateSkuModal>
                        </CardFooter>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 md:gap-6">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Imagens do produto</CardTitle>
                            <CardDescription>
                                Adicione ou remova imagens do produto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <DeleteProductImageModal onDeleteImage={handleDeleteImage} id={params.id as string} fileName={
                                    images.length !== 0 ? (thumbIndex === -1 ? images[0] : images[thumbIndex]).name : null
                                }>
                                    <div className="bg-muted rounded-xl relative" style={{ aspectRatio: '3/4' }}>
                                        <Image
                                            src={
                                                images.length !== 0
                                                    ? (thumbIndex === -1 ? images[0] : images[thumbIndex]).url
                                                    : '/assets/icons/placeholder.png'
                                            }
                                            priority quality={100}
                                            layout="fill"
                                            alt="product image" className="py-2 m-auto" style={{ maxWidth: 200, objectFit: 'contain' }} />
                                    </div>
                                </DeleteProductImageModal>
                                <div className="grid grid-cols-3 gap-2">
                                    {images.length > 1
                                        ? images.map(({ url, name }) => {
                                            return (
                                                <DeleteProductImageModal key={name} onDeleteImage={handleDeleteImage} id={params.id as string} fileName={name}>
                                                    <button className="bg-muted rounded-xl overflow-hidden relative aspect-square">
                                                        <Image src={url}
                                                            priority quality={100}
                                                            layout="fill"
                                                            alt="product image" className="py-2 m-auto" style={{ maxWidth: 200, objectFit: 'contain' }} />
                                                    </button>
                                                </DeleteProductImageModal>
                                            )
                                        })
                                        : Array.from({ length: 2 }).map((_, indx) => (
                                            <div key={indx} className="bg-muted rounded-md overflow-hidden">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square w-full object-contain"
                                                    height="84"
                                                    src={'/assets/icons/placeholder.png'}
                                                    width="84"
                                                />
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                            <CardFooter className="p-0 mt-2">
                                <UploadImage colors={JSON.parse(product.metadata["colors"])} id={product.id} handleUploadImages={onUploadImages} imagesCount={images.length}>
                                    <Button className="w-full flex gap-2">
                                        <Upload className="h-4 w-4" />
                                        <span>Adicionar</span>
                                    </Button>
                                </UploadImage>
                            </CardFooter>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </main>
    )
}