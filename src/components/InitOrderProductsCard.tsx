import { CartProduct } from "@/app/(store)/cart/content"
import Image from "next/image"

export function OrderProductsCard({ image, name, color, priceId, price, productId, category }: CartProduct) {
    const { nickname } = price
    return (
        <div key={productId} className="w-full overflow-hidden flex gap-4 h-fit items-center relative">
            <div className="bg-muted/40 rounded-[20px] aspect-square size-32 relative">
                <Image src={image}
                    priority quality={100}
                    layout="fill"
                    alt="product image" className="w-full p-2" style={{ objectFit: 'contain' }} />
            </div>
            <div className="grid pl-3 gap-2">
                <header className="font-semibold py-2">
                    <p>{nickname ? `${name} - ${nickname}` : name}</p>
                    {category !== "software" && (
                        <span className="flex gap-1 w-full justify-start text-sm">
                            <p>Colore:</p>
                            <p className="font-normal opacity-80">{color}</p>
                        </span>
                    )}
                </header>
                <span className="text-sm" data-price={priceId}>
                    {
                        price.unit_amount === 0 ? "Free" : price.unit_amount && (price.unit_amount / 100).toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'EUR'
                        })
                    }
                </span>

            </div>
        </div>
    )
}