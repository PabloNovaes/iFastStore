import { stripe } from "@/services/stripe/config";
import { Metadata } from "next";
import { Search } from "./content";

export const metadata: Metadata = {
  title: "Tutti i Prodotti | iFast Store",
  description:
    "Esplora la nostra collezione di iPhone, Notebook e accessori originali.",
  robots: "index, follow",
};

export default async function Page() {
  try {
    const response = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const products = response.data.filter((product) => product.default_price);

    return <Search products={products} />;
  } catch (error) {
    console.error("Stripe Fetch Error:", error);
    return <Search products={[]} />;
  }
}
