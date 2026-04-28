import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/products"],
      disallow: ["/api", "/dashboard"],
    },
    sitemap: "https://ifaststore.it/sitemap.xml",
  };
}
