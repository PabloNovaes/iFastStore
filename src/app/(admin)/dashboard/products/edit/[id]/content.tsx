'use client'

import { changeProductCategory, changeProductStatus, deleteProductColor, upadteShippingTax, updateProductDescription, updateProductName } from "@/app/actions";
import { CreateSkuModal } from "@/components/dashboard/CreateSkuModal";
import { DeleteProductImageModal } from "@/components/dashboard/DeleteProductImageModal";
import { UpdateProductColorsModal } from "@/components/dashboard/UpdateProductColorsModal";
import { UpdateSkuForm } from "@/components/dashboard/UpdateSkuForm";
import { UploadImage } from "@/components/dashboard/UploadImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { CaretLeft, PlusCircle, Spinner, Trash, Upload } from "@phosphor-icons/react";
import { motion, useAnimate } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import Stripe from "stripe";
import { Product } from "../../content";

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

function useShowSaveChangeDescriptionButton(showSaveButton: boolean) {
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const [_, animate] = useAnimate();

    useEffect(() => {
        if (scopeRef.current) {
            animate(
                scopeRef.current,
                showSaveButton
                    ? { height: "fit-content" }
                    : { height: 0 },
                {
                    type: "spring",
                    bounce: 0,
                    duration: 0.3,
                }
            );
        }
    }, [animate, showSaveButton]);

    return scopeRef;
}

function useShowSaveChangeNameButton(showSaveButton: boolean) {
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const [_, animate] = useAnimate();

    useEffect(() => {
        if (scopeRef.current) {
            animate(
                scopeRef.current,
                showSaveButton
                    ? { height: "fit-content" }
                    : { height: 0 },
                {
                    type: "spring",
                    bounce: 0,
                    duration: 0.3,
                }
            );
        }
    }, [animate, showSaveButton]);

    return scopeRef;
}

export function ProductDetails({ params }: Params) {
    const [currentImage, setCurrentImage] = useState<{ name: string, url: string } | null>(null)
    const [images, setImages] = useState<{ name: string, url: string }[]>([])
    const [colors, setColors] = useState<{ name: string, code: string }[]>([])
    const [product, setProduct] = useState<Product>()
    const [Skus, setSkus] = useState<SKUProps[]>([])

    const [showSaveButton, setShowSaveButton] = useState(false)
    const [showChangeNameButton, setShowChangeNameButton] = useState(false)
    const { pending } = useFormStatus()

    const changeNameScope = useShowSaveChangeNameButton(showChangeNameButton)
    const changeDescriptionScope = useShowSaveChangeDescriptionButton(showSaveButton)
    const router = useRouter()


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/products/find?id=${params.id}`)
            const data = await response.json() as Product

            const productsImages = data.images as { name: string, url: string }[]

            setProduct(data)
            setImages(productsImages)
            setCurrentImage(productsImages[0])

            if (data.metadata["category"] !== "software") {
                setColors(JSON.parse(data.metadata["colors"]) as { name: string, code: string }[])
            }

            const skusData: SKUProps[] = data.prices
                .sort((a, b) => {
                    const aPrice = a as Stripe.Price
                    const bPrice = b as Stripe.Price

                    return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
                })
                .map(({ unit_amount, id, metadata, nickname }) => ({ priceId: id, unit_amount, ...JSON.parse(metadata["SKU"]), nickname }))

            return setSkus(skusData)
        }

        fetchData()

    }, [])

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
        const newSku = {
            priceId: id as string,
            unit_amount: unit_amount as number,
            nickname: nickname as string,
            stock: stock as number,
            available_colors: category !== "software" ? available_colors : []
        } as SKUProps

        setSkus((state) => [...state, { ...newSku }])
    }

    const handleUploadImages = (data: { name: string, url: string }[]) => {
        setImages((state) => [...data, ...state])
        setCurrentImage(data[0])
    }

    const handleDeleteImage = (fileName: string) => {
        const updatedImages = [...images.filter(image => image.name !== fileName)]

        setCurrentImage(updatedImages[0])
        setImages([...updatedImages])
    }

    const handleUpdateColors = ({ colors, updatedPrices }: { colors: { name: string, code: string }[], updatedPrices: Stripe.Price[] }) => {
        setColors(colors)
        const skusData: SKUProps[] = updatedPrices
            .sort((a, b) => {
                const aPrice = a as Stripe.Price
                const bPrice = b as Stripe.Price

                return Number(aPrice.unit_amount) - Number(bPrice.unit_amount)
            })
            .map(({ unit_amount, id, metadata, nickname }) => ({ priceId: id, unit_amount, ...JSON.parse(metadata["SKU"]), nickname }))
        setSkus(skusData)
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    if (!product) return

    const stockCount = Skus.reduce((acc, count) => { return acc + count.stock }, 0)
    const shippingTax = product.metadata["shipping_tax"]
    const category = product.metadata["category"] as string

    return (
        <main className="p-4 sm:px-6 flex flex-col max-w-[64rem] w-full m-auto gap-4 bg-primary-foreground/30">
            <header className="flex items-center gap-4">
                <Button variant={"outline"} className="p-1 h-fit" onClick={() => router.replace('/dashboard/products')}>
                    <CaretLeft weight="bold" size={14} />
                </Button>
                <h1 className="text-xl font-semibold line-clamp-1">{product.name}</h1>
                <Badge variant={stockCount > 0 ? "green" : "warning"} className="h-fit whitespace-nowrap">{stockCount > 0 ? "Em estoque" : "Sem estoque"}</Badge>
            </header>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 h-full">
                <div className="flex flex-col gap-4 md:gap-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do produto</CardTitle>
                            <CardDescription>Todos os detalhes do produto</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <form className="flex flex-col items-end gap-2" action={async () => {
                                if (inputRef.current === null) return
                                toast.promise(updateProductName({ id: product.id, name: inputRef.current.value }), {
                                    loading: "Aguarde...", success: () => {
                                        setProduct((prev) => {
                                            return { ...prev, name: (inputRef.current as HTMLInputElement).value } as Product
                                        })
                                        return "Nome alterado com sucesso!"
                                    }
                                })
                                setShowChangeNameButton(false)
                            }}>
                                <label className="font-medium w-full text-sm">
                                    Nome
                                    <Input ref={inputRef}
                                        onChange={() => setShowChangeNameButton(true)}
                                        name="name" defaultValue={product.name} className="mt-1" placeholder="Nome do produto" />
                                </label>
                                <motion.div id="save-name" ref={changeNameScope} className="h-0 overflow-hidden">
                                    <Button className="w-fit" type="submit">
                                        {pending ? <Spinner size={22} className=" animate-spin" /> : "Salvar"}
                                    </Button>
                                </motion.div>
                            </form>
                            {product.description !== "" &&
                                <label className="font-medium text-sm">
                                    Descrição
                                    <form className="flex flex-col items-end gap-2" action={async () => {
                                        if (textareaRef.current === null) return
                                        toast.promise(updateProductDescription({ id: product.id, description: textareaRef.current.value }), {
                                            loading: "Aguarde...", success: "Descrição alterada com sucesso!"
                                        })
                                        setShowSaveButton(false)
                                    }}>
                                        <Textarea defaultValue={product.description as string} ref={textareaRef}
                                            onChange={() => setShowSaveButton(true)}
                                            className="mt-1" placeholder="Descrição" />
                                        <motion.div id="save-description" ref={changeDescriptionScope} className="h-0 overflow-hidden">
                                            <Button className="w-fit" type="submit">
                                                {pending ? <Spinner size={22} className=" animate-spin" /> : "Salvar"}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </label>
                            }
                            <div className="grid gap-4 grid-cols-2">
                                <div className="grid gap-3 col-span-2">
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
                                            <SelectItem value="headphone">Fones de ouvido</SelectItem>
                                            <SelectItem value="notebook">Notebooks</SelectItem>
                                            <SelectItem value="accessories">Acessorios</SelectItem>
                                            <SelectItem value="software">Software</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3">
                                    <label className="font-medium text-sm" htmlFor="status">Status</label>
                                    <Select onValueChange={async (value: string) => await changeProductStatus({ id: (product.id as string), active: value === "true" ? true : false })}>
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
                                                Number(shippingTax) === 0 ? "Free" : (Number(shippingTax) / 100).toLocaleString("it-IT", { style: "currency", currency: "eur" })} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"0"}>Free</SelectItem>
                                            <SelectItem value={"1299"}>{(1299 / 100).toLocaleString("it-IT", { style: "currency", currency: "eur" })}</SelectItem>
                                            <SelectItem value={"899"}>{(899 / 100).toLocaleString("it-IT", { style: "currency", currency: "eur" })}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {category !== "software" && < div className="grid gap-3">
                                <label htmlFor="colors-control" className="flex gap-2 items-center font-medium text-sm">
                                    Cores do produto

                                </label>
                                <div className="inline-flex flex-wrap gap-2">
                                    {colors.map((color) => {
                                        const { name, code } = color
                                        return (
                                            <ContextMenu key={name}>
                                                <ContextMenuTrigger>
                                                    <div className="border rounded-lg shadow-sm p-1 px-2 flex gap-2 items-center">
                                                        <div className="rounded-sm size-4" style={{ background: code }}></div>
                                                        <span className="text-sm select-none">{name}</span>
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem className="flex gap-2" onClick={async () => {
                                                        toast.promise(deleteProductColor({ removeColor: color, colors: colors.filter(color => color.name !== name), id: product.id }), {
                                                            loading: "Aguarde...",
                                                            success: (res) => {
                                                                handleUpdateColors(res)
                                                                return "Cor removida com sucesso!"
                                                            }, error: () => "Ocorreu um erro inesperado!"
                                                        })

                                                    }}>
                                                        <Trash />
                                                        Remover
                                                    </ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>

                                        )
                                    })}
                                    <UpdateProductColorsModal onUpdateColors={handleUpdateColors} id={product.id} colors={colors}>
                                        <Button size={"icon"} variant={"outline"} className="rounded-lg size-7">
                                            <PlusCircle size={16} />
                                        </Button>
                                    </UpdateProductColorsModal>
                                </div>
                            </div>
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estoque</CardTitle>
                            <CardDescription>
                                Detalhes do estoque e variações dos produtos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="border rounded-xl mx-6 mb-6 px-0 pb-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">SKU</TableHead>
                                        <TableHead className="text-center">Estoque</TableHead>
                                        <TableHead className="text-center">Preço</TableHead>
                                        <TableHead className={`${product.metadata["category"] === "software" && "hidden"} text-center`}>Cores</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Skus.map((sku) => {
                                        const { unit_amount, priceId, stock, available_colors, nickname } = sku
                                        const availableCount = available_colors.filter(color => color.available).length
                                        return (
                                            <TableRow key={priceId} className="relative">
                                                <TableCell className="font-semibold text-center">{nickname}</TableCell>
                                                <TableCell className="text-center">
                                                    {stock}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {(unit_amount / 100).toFixed(2)}
                                                </TableCell>
                                                {category !== "software" && (
                                                    <TableCell className={`text-center ${product.metadata["category"] === "software" && "hidden"}`} id="colors">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant={"outline"} className="min-w-[84px] relative z-10">
                                                                    {availableCount === 1 && "1 cor"}
                                                                    {availableCount === 0 && "Nenhuma cor"}
                                                                    {availableCount > 1 && `${availableCount} cores`}
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Cores</DropdownMenuLabel>
                                                                {category !== "software" && available_colors.map(({ name, code, available }) => {
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
                                                )}
                                                <UpdateSkuForm productCategory={product.metadata["category"]} {...sku} productId={product.id} onUpdateSku={handleUpdatedSku} />
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="justify-center border-t p-4">
                            <CreateSkuModal onUpdateCreateNewSku={handleCreateNewSku} productData={{ id: product.id, colors }}>
                                <Button size="sm" variant="ghost" className="gap-1 h-10 w-full">
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
                        <CardContent className="grid gap-2 justify-stretch">
                            {
                                images.length !== 0 && (
                                    <>
                                        <DeleteProductImageModal newThumbImage={images[0].url} onDeleteImage={handleDeleteImage} id={params.id as string} fileName={currentImage?.name || ""}>
                                            <div className="bg-muted rounded-xl relative max-h-[300px] w-full" style={{ aspectRatio: '3/4' }}>
                                                <img
                                                    src={currentImage?.url as string}
                                                    alt="product image" className="m-auto py-3" style={{ objectFit: 'contain', height: "100%" }} />
                                            </div>
                                        </DeleteProductImageModal>
                                        <Carousel className="w-full m-0">
                                            <CarouselContent>
                                                {images.map((image, index) => {
                                                    const { url, name } = image
                                                    return (
                                                        <CarouselItem onClick={() => setCurrentImage(image)} className={`basis-1/3 ${images.length < 3 && "basis-1/2"}`} key={index}>
                                                            <DeleteProductImageModal newThumbImage={images[0].url} onDeleteImage={handleDeleteImage} id={params.id as string} fileName={name}>
                                                                <div className="rounded-2xl bg-muted/40 relative h-[120px]">
                                                                    <Image src={url}
                                                                        priority quality={100}
                                                                        layout="fill"
                                                                        alt="product image" className="m-auto object-contain py-3" />
                                                                </div>
                                                            </DeleteProductImageModal>
                                                        </CarouselItem>
                                                    )
                                                })}

                                            </CarouselContent>
                                            <CarouselPrevious className="-left-[5%]" />
                                            <CarouselNext className="-right-[5%]" />
                                        </Carousel>
                                    </>
                                )
                            }
                            <CardFooter className="p-0 mt-2">
                                <UploadImage category={category} colors={JSON.parse(product.metadata["colors"])} id={product.id} handleUploadImages={handleUploadImages} imagesCount={images.length}>
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
        </main >
    )
}
