"use client";

import { Product } from "@/app/(admin)/dashboard/products/content";
import { ProductData } from "@/components/ProductData";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import Image from "next/image";
import { useMemo, useState } from "react";

interface Props {
  initialProduct: Product;
}

export function ProductDetail({ initialProduct }: Props) {
  const [colorFilter, setColorFilter] = useState(() => {
    // Inicializa o filtro de cor no servidor/primeiro render
    if (initialProduct.metadata["category"] === "software") return "";

    const firstAvailablePrice = initialProduct.prices
      .sort((a, b) => Number(a.unit_amount) - Number(b.unit_amount))
      .map((price) => {
        try {
          return JSON.parse(price.metadata["SKU"] as string);
        } catch {
          return { stock: 0, available_colors: [] };
        }
      })
      .find((sku) => sku.stock !== 0);

    const color = firstAvailablePrice?.available_colors.find((c: any) =>
      initialProduct.images.some((img) => img.name.startsWith(c.name)),
    );

    return color?.name || "";
  });

  const [activeImage, setActiveImage] = useState("");

  const handleSetFilterImagesByColor = (color: string) => {
    setColorFilter(color);
    setActiveImage("");
  };

  // Simplificação das variáveis usando useMemo para performance
  const { images, prices, ...rest } = initialProduct;
  const shippingTax = Number(rest.metadata["shipping_tax"]);
  const category = rest.metadata["category"] as string;

  const filteredImages = useMemo(() => {
    return colorFilter === ""
      ? images
      : images.filter((img) => img.name.includes(colorFilter));
  }, [colorFilter, images]);

  const sortedPrices = useMemo(() => {
    return [...prices].sort(
      (a, b) => Number(a.unit_amount) - Number(b.unit_amount),
    );
  }, [prices]);

  return (
    <main className="max-w-5xl m-auto py-4 px-4 flex flex-col main-height">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-8 flex-1">
        <div
          className="py-3 grid gap-3 relative"
          style={{ gridTemplateRows: "1fr min-content" }}>
          <div className="rounded-[30px] bg-muted/40 relative min-h-[260px]">
            {filteredImages.length !== 0 ? (
              <Image
                src={activeImage === "" ? filteredImages[0].url : activeImage}
                priority
                quality={100}
                fill
                alt={initialProduct.name}
                style={{
                  maxWidth: 260,
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            ) : (
              <Image
                src={"/assets/icons/placeholder.png"}
                priority
                fill
                alt="placeholder"
                style={{
                  maxWidth: 260,
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            )}
            {shippingTax === 0 && (
              <Badge
                variant={"green"}
                className="text-[9px] absolute left-3 bottom-3 z-20 rounded-full">
                spedizione gratuita
              </Badge>
            )}
          </div>

          {filteredImages.length > 1 && (
            <RadioGroup
              className="grid gap-3 rounded-3xl grid-cols-4 md:grid-cols-2"
              value={activeImage || filteredImages[0].url}
              onValueChange={(value: string) => setActiveImage(value)}>
              {filteredImages.map(({ name, url }) => (
                <RadioGroupItem
                  key={name}
                  value={url}
                  className="rounded-2xl bg-muted/40 relative flex aspect-square data-[state=unchecked]:opacity-50 transition-opacity duration-300">
                  <Image
                    src={url}
                    priority
                    quality={100}
                    fill
                    alt={name}
                    className="py-2 m-auto"
                    style={{ maxWidth: 150, objectFit: "contain" }}
                  />
                </RadioGroupItem>
              ))}
            </RadioGroup>
          )}
        </div>

        <ProductData
          {...{
            ...rest,
            category,
            images: filteredImages,
            prices: sortedPrices,
          }}
          onSetFilterImagesToColor={handleSetFilterImagesByColor}
        />
      </div>
    </main>
  );
}
