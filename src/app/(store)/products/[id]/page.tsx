import { generateProductJsonLd } from "@/app/generate-jsonld";
import { stripe } from "@/services/stripe/config";
import Stripe from "stripe";
import { ProductDetail } from "./content";

export const metadata = {
  title: "Dettagli del prodotto",
};

export default async function Page({ params }: { params: { id: string } }) {
  const product = await stripe.products.retrieve(params.id, {
    expand: ["default_price"],
  });
  const price = product.default_price as Stripe.Price;

  const jsonLd = generateProductJsonLd(product, price);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail params={params} />
    </>
  );
}
