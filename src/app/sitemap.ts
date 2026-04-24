import { stripe } from "@/services/stripe/config";
import { MetadataRoute } from "next";

const baseURL = "https://ifaststore.it/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseURL, lastModified: new Date(), priority: 1 },
    { url: `${baseURL}products`, lastModified: new Date(), priority: 0.8 },
    {
      url: `${baseURL}products/category/iphone`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseURL}products/category/headphone`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseURL}products/category/notebooks`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseURL}products/category/software`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseURL}products/category/accessories`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  try {
    const response = await stripe.products.list({
      limit: 100,
      active: true,
    });

    const products = response.data.filter(
      (product) => product.metadata?.category === "iphone",
    );

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseURL}products/${product.id}`,
      lastModified: new Date(),
      priority: 0.6,
    }));

    return [...staticRoutes, ...productEntries];
  } catch (error) {
    console.error(
      "Sitemap Build Error: Stripe products could not be fetched.",
      error,
    );
    return staticRoutes;
  }
}
