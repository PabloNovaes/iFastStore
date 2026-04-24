import { generateProductJsonLd } from "@/app/generate-jsonld";
import { stripe } from "@/services/stripe/config";
import { Metadata } from "next";
import Stripe from "stripe";
import { ProductDetail } from "./content";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await stripe.products.retrieve(params.id);
  return {
    title: `${product.name} | iFast Store`,
    description: product.description || "Dettagli del prodotto su iFast Store",
  };
}

export default async function Page({ params }: PageProps) {
  // Busca o produto com os preços expandidos direto no servidor
  const product = await stripe.products.retrieve(params.id, {
    expand: ["default_price"],
  });

  // Também buscamos a lista de preços completa para garantir que o Client tenha tudo
  const pricesResponse = await stripe.prices.list({
    product: params.id,
    active: true,
  });

  const fullProduct = {
    ...product,
    prices: pricesResponse.data,
  };

  const price = product.default_price as Stripe.Price;
  const jsonLd = generateProductJsonLd(product, price);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Passamos o produto já carregado para o Client Component */}
      <ProductDetail initialProduct={fullProduct as any} />
    </>
  );
}
