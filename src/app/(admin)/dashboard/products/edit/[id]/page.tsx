import { ProductDetails } from "./content"

export const metadata = {
    title: "Detalhes do produto"
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductDetails params={params} />
}


