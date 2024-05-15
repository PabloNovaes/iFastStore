import { ProductDetail } from "./content"

export const metadata = {
    title: "Dettagli del prodotto"
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductDetail params={params}/>
}