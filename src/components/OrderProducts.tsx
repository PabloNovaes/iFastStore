import { OrdersProps } from "@/app/(store)/account/content";
import { confirmDelivery } from "@/app/actions";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleNotch } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

interface Props extends OrdersProps {
    onConfirmDelivery: (orderid: string) => void
}

export function OrderProductCard({ id, payment_method, products, status, shipping_code, created_at, shipping_tax, onConfirmDelivery }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const { push } = useRouter()

    return (
        <AccordionItem value={id} className="border-b-0 p-0">
            <AccordionTrigger className="px-1">
                <div className="flex flex-col gap-2 items-start pr-5">
                    <p className="font-semibold">ordinare con {products.length} prodotto</p>
                    {shipping_code && shipping_code.trim() !== "" && <p className="text-sm font-light items-center opacity-70 flex gap-3">
                        <span>{shipping_code}</span>
                        <CopyCode code={shipping_code} />
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
                            const checkoutProducts = products.map(({ price, ...rest }) => {
                                return { ...rest, price, model: price.nickname }
                            })

                            const response = await fetch("/api/checkout/init", {
                                method: "POST",
                                body: JSON.stringify({ products: checkoutProducts, payment_method, id, shipping_tax })
                            })

                            const data = await response.json()

                            push(data.url)
                        })}>Paga ora</Button>
                    </footer>
                }
                {
                    status === "ORDER_DISPATCHED" &&
                    <footer className="pb-2">
                        <Dialog>
                            <DialogTrigger className="w-full">
                                <Button className="w-full">Confermare la consegna</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>Ne sei assolutamente sicuro?</DialogHeader>
                                <DialogDescription>
                                    Questa azione non può essere annullata.
                                    Assicurati di aver ricevuto correttamente il tuo ordine
                                    prima di confermare la ricezione.
                                </DialogDescription>
                                <DialogFooter>
                                    <DialogClose>
                                        <Button variant="outline">Anulla</Button>
                                    </DialogClose>
                                    <Button type="submit" onClick={async () => {
                                        try {
                                            setIsLoading(true)
                                            await confirmDelivery(id)
                                            
                                            onConfirmDelivery(id)
                                            return toast.success("Consegna confermata")
                                        } catch (err) {
                                            toast.error("Si è verificato un errore imprevisto")
                                            throw err
                                        }
                                    }}>
                                        {isLoading ? <CircleNotch size={22} className=" animate-spin" /> : "Confermare"}

                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </footer>
                }
            </AccordionContent>
        </AccordionItem>

    )
}