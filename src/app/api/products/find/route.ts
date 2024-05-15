import { storage } from "@/services/firebase/firebase.config";
import { stripe } from "@/services/stripe/config";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const productId = req.nextUrl.searchParams.get('id') as string

        const product = await stripe.products.retrieve(productId, {
            expand: ['default_price']
        })

        const path = ref(storage, productId)

        const [files, prices] = await Promise.all([
            listAll(path), stripe.prices.list({ product: productId })
        ])

        const { images, ...rest } = product

        let imagesURLs: { name: string, url: string }[] = []

        for await (const file of files.items) {
            const urlPromise = await getDownloadURL(ref(storage, `${productId}/${file.name}`));
            imagesURLs.push({ name: file.name, url: urlPromise })
        }
        

        return NextResponse.json({ ...rest, images: imagesURLs, prices: prices.data })
    } catch (error) {
        return NextResponse.json({ error })
    }
}