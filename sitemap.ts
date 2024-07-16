import { stripe } from "@/services/stripe/config";
import { MetadataRoute } from "next";
import Stripe from "stripe";

const baseURL = 'https://ifaststore.it/'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products: Stripe.Product[] = (await stripe.products.list()).data
        .filter(product => product.metadata?.category === 'iphone')

    return [
        {
            url: baseURL,
            lastModified: new Date(),
            priority: 1,
        },
        {
            url: baseURL.concat("products"),
            lastModified: new Date(),
            priority: .8,
        },
        {
            url: baseURL.concat("category/iphone"),
            lastModified: new Date(),
            priority: .8,
        },
        {
            url: baseURL.concat("category/airpods"),
            lastModified: new Date(),
            priority: .8,
        },
        {
            url: baseURL.concat("category/notebooks"),
            lastModified: new Date(),
            priority: .8,
        },
        ...products.map(({ id }) => ({
            url: baseURL.concat(`products/${id}`),
            lastModified: new Date()
        }))

    ]
}