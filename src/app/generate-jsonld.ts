import Stripe from "stripe";

export function generateProductJsonLd(product: Stripe.Product, price?: Stripe.Price) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images[0],
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Apple" // Ou dinâmico via metadata
        },
        "offers": {
            "@type": "Offer",
            "url": `https://ifaststore.it/products/${product.id}`,
            "priceCurrency": price?.currency.toUpperCase() || "EUR",
            "price": price?.unit_amount ? price.unit_amount / 100 : "0.00",
            "availability": product.active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };
}