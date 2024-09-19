'use client'

import { ProductData } from "@/components/ProductData"

import Image from "next/image"
import Loading from "./loading"

import { Product } from "@/app/(admin)/dashboard/products/content"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { useEffect, useState } from "react"

interface Props {
    params: { id: string }
}

export function ProductDetail({ params }: Props) {
    const [product, setProduct] = useState<Product>()
    const [colorFilter, setColorFilter] = useState("")
    const [activeImage, setActiveImage] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/products/find?id=${params.id}`, {
                next: {
                    tags: ['product-detail']
                },
                cache: "no-store"
            })
            const data = await response.json() as Product

            const price = data.prices
                .sort((a, b) => Number(a.unit_amount) - Number(b.unit_amount))
                .map((price) => JSON.parse(price.metadata["SKU"] as string) as {
                    stock: number, available_colors: { name: string, code: string, available: boolean }[]
                })
                .find(price => price.stock !== 0)


            if (data.metadata["category"] as string !== "software") {
                const color = price?.available_colors.find(color => color.available)
                setColorFilter(color?.name as string)
            }
            setProduct(data)
        }

        fetchData()

    }, [params])

    if (!product) return <Loading />

    const handleSetFilterImagesByColor = (color: string) => {
        setColorFilter(color)
        setActiveImage("")
    }

    const { images, prices, ...rest } = product

    const category = rest.metadata["category"] as string

    const filteredImages = colorFilter === "" ? images : images.filter(images => images.name.includes(colorFilter))

    return (
        <>
            <main className=" max-w-5xl m-auto py-4 px-4 flex flex-col main-height">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-8 flex-1">
                    <div className="py-3 grid gap-3 relative" style={{ gridTemplateRows: '1fr min-content' }}>
                        <div className="rounded-[30px] bg-accent relative min-h-[260px]">
                            {filteredImages.length !== 0
                                ? <Image src={activeImage === '' ? filteredImages[0].url : activeImage} priority quality={100}
                                    layout="fill" alt="product image" style={{ maxWidth: 260, objectFit: 'contain', margin: '0 auto' }} />

                                : <Image src={"/assets/icons/placeholder.png"} priority quality={100}
                                    layout="fill" alt="product image" style={{ maxWidth: 260, objectFit: 'contain', margin: '0 auto' }} />

                            }
                        </div>

                        {filteredImages.length > 1 &&
                            <RadioGroup className="grid gap-3 rounded-3xl" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))" }} defaultValue={filteredImages[0].url}
                                onValueChange={(value: string) => setActiveImage(value)}>
                                {filteredImages.map(({ name, url }) => (
                                    <RadioGroupItem key={name} value={url} className="rounded-2xl bg-accent relative flex aspect-square data-[state=unchecked]:opacity-50 transition-opacity duration-300">
                                        <Image src={url}
                                            priority quality={100}
                                            layout="fill"
                                            alt="product image" className="py-2 m-auto" style={{ maxWidth: 150, objectFit: 'contain' }} />
                                    </RadioGroupItem>
                                ))}
                            </RadioGroup>
                        }
                    </div>
                    <ProductData {...{ ...rest, category, images: filteredImages, prices: prices.sort((a, b) => Number(a.unit_amount) - Number(b.unit_amount)) }} onSetFilterImagesToColor={handleSetFilterImagesByColor} />
                </div>
            </main>
        </>
    )
}
