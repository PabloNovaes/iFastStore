"use client";

import { NotResultsFound } from "@/components/NotResults";
import { ProductCard } from "@/components/ProductCard";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter, useSearchParams } from "next/navigation";
import Stripe from "stripe";

interface SearchProps {
  products: Stripe.Product[];
}

export function Search({ products }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryText = searchParams.get("name");
  const sortBy = searchParams.get("sort-by");

  // 1. Lógica de Filtragem
  const filteredProducts = products.filter((product) => {
    const normalizedQuery = queryText?.toLowerCase().trim() || "";
    const name = product.name.toLowerCase();
    const description = product.description?.toLowerCase() || "";

    return (
      name.includes(normalizedQuery) || description.includes(normalizedQuery)
    );
  });

  // 2. Lógica de Ordenação (Imutável)
  const getSortedProducts = (list: Stripe.Product[]) => {
    if (!sortBy) return list;

    return [...list].sort((a, b) => {
      const priceA = (a.default_price as Stripe.Price).unit_amount || 0;
      const priceB = (b.default_price as Stripe.Price).unit_amount || 0;

      if (sortBy === "lowest_price") return priceA - priceB;
      if (sortBy === "biggest_price") return priceB - priceA;
      return 0;
    });
  };

  const displayProducts = getSortedProducts(filteredProducts);

  return (
    <main
      className="px-5 flex flex-col gap-4 max-w-5xl m-auto pt-5"
      style={{ minHeight: "calc(100svh - 50px)" }}>
      <div className="w-full py-5 flex flex-col">
        <h1 className="text-xl font-semibold">
          {queryText == null
            ? "Tutti prodotti"
            : `Resultati per "${queryText}"`}
        </h1>

        <RadioGroup
          className="filter-selector flex gap-3 text-sm flex-1 mt-4"
          value={sortBy || ""}
          onValueChange={(value: string) => {
            const queryParams = new URLSearchParams(searchParams.toString());
            queryParams.set("sort-by", value);
            router.push(`/products?${queryParams.toString()}`);
          }}>
          <RadioGroupItem
            value={"lowest_price"}
            className="border px-4 py-1 rounded-2xl data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-muted/40 flex items-center gap-2 transition-colors duration-300">
            Prezzo <ArrowDown size={14} />
          </RadioGroupItem>

          <RadioGroupItem
            value={"biggest_price"}
            className="border px-4 py-1 rounded-2xl data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-muted/40 flex items-center gap-2 transition-colors duration-300">
            Prezzo <ArrowUp size={14} />
          </RadioGroupItem>
        </RadioGroup>
      </div>

      {/* Renderização condicional: se houver produtos, o Google os verá no HTML inicial */}
      {displayProducts.length > 0 ? (
        <div className="grid gap-5 grid-cols-2 pb-5 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <NotResultsFound className="my-0" />
      )}
    </main>
  );
}
