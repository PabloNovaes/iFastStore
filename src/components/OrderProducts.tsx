import { OrdersProps } from "@/app/account/page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CopyCode } from "./CopyCode";
import { Button } from "./ui/button";

const orderStatus = {
    AWAITING_PAYMENT: "Pendente",
    AWAITING_SEND: "Preparazione",
    ORDER_DISPATCHED: "Ordine Spedito",
    ORDER_DELIVERED: "Ordine consegnato"
} as any

const paymentMethods = {
    card: "Carta",
    paypal: 'Paypal',
    boleto: 'Boleto',
} as any

export function OrderProductCard({ id, payment_method, products, status, shippin_code, created_at }: OrdersProps) {
    const { push } = useRouter()

    return (
        <Accordion type="single" defaultValue={id} collapsible className="border h-fit px-2 rounded-xl w-full bg-white">
            <AccordionItem value={id} className="border-b-0 p-0">
                <AccordionTrigger className="px-1">
                    <div className="flex flex-col gap-2 items-start pr-5">
                        <p className="font-semibold">ordinare con {products.length} prodotto</p>
                        {shippin_code && shippin_code.trim() !== "" && <p className="text-sm font-light items-center opacity-70 flex gap-3">
                            <span>{shippin_code}</span>
                            <CopyCode code={shippin_code} />
                        </p>}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                    <header className="bg-accent rounded-lg  flex items-center justify-between p-2 px-3">
                        <span className="flex flex-col items-start">
                            <p className="font-semibold text-[14px]">Stato</p>
                            <p className="text-xs">{orderStatus[status]}</p>
                        </span>
                        <span className="flex flex-col items-start">
                            <p className="font-semibold text-[14px]">Data</p>
                            <p className="text-xs">{new Date(created_at).toLocaleString()}</p>
                        </span>
                        <span className="flex flex-col items-start">
                            <p className="font-semibold text-[14px]">Pagamento</p>
                            <p className="text-xs">{paymentMethods[payment_method]}</p>
                        </span>
                    </header>
                    <ScrollArea id="scroll-area" className="h-36 py-2" >
                        {products.map(({ id, imageUrl, name, color, price }) => (
                            <div key={id} className="h-fit w-full rounded-[20px] items-center flex gap-3">
                                <div className="bg-accent p-2 size-32 rounded-xl relative">
                                    <Image src={imageUrl}
                                        priority quality={100}
                                        layout="fill"
                                        alt="product image" className="w-full p-2" style={{ objectFit: 'contain' }} />

                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="font-semibold">{price.nickname ? `${name} - ${price.nickname}` : name}</p>
                                    <span className="flex gap-1 w-full justify-start pb-3 text-sm">
                                        <p className="font-semibold">Colore:</p>
                                        <p className="font-normal opacity-80">{color}</p>
                                    </span>
                                    <p>{price.unit_amount && (price.unit_amount / 100).toLocaleString("it-IT", {
                                        style: "currency",
                                        currency: "EUR",
                                    })}</p>
                                </div>
                            </div>
                        ))}

                    </ScrollArea>
                    {
                        status === "AWAITING_PAYMENT" &&
                        <footer className="pb-2">
                            <Button className="w-full" onClick={(async () => {
                                const checkoutProducts = products.map(({ priceId, quantity, color, price, imageUrl, name }) => {
                                    return { priceId, quantity, color, model: price.nickname, imageUrl, name, price }
                                })

                                const response = await fetch("/api/checkout/init", {
                                    method: "POST",
                                    body: JSON.stringify({ products: checkoutProducts, payment_method, id })
                                })

                                const data = await response.json()

                                push(data.url)
                            })}>Pagar agora</Button>
                        </footer>
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>

    )
}