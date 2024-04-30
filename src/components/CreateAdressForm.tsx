import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { CircleNotch } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";

interface CreateAdressFormProps {
    children: ReactNode;
    onSubmit: (data: CreateAdressSchema) => void;
}


export const createAdressSchema = z.object({
    name: z.string().min(5, 'il nome è obbligatorio'),
    email: z.string().min(5, "il email è obbligatorio").email("Formato non valido"),
    cellphone: z.string().min(10, 'il cellulare è obbligatorio').max(10, "deve avere 10 cifre"),
    street: z.string().min(10, "La strada è obbligatoria"),
    cap: z.string().min(5, "il CAP è obbligatorio").max(5, "Deve avere 5 cifre"),
    city: z.string().min(5, "La citta è obbligatoria"),
    complement: z.string().optional(),

})

export type CreateAdressSchema = z.infer<typeof createAdressSchema>

export function CreteAdressForm({ onSubmit, children }: CreateAdressFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAdressSchema>({
        resolver: zodResolver(createAdressSchema),
    })


    return (
        <Dialog>
            <DialogTrigger asChild>{children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Nuovo indirizzo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit((data: CreateAdressSchema)=> {
                    setIsLoading(true)
                    return onSubmit(data)
                })} className="grid gap-2">
                    <label className="text-sm grid gap-2" htmlFor="name">
                        Nome
                        <Input className={`${errors.name && 'border-red-500'}`} {...register("name")} type="text" id="name" autoComplete="name" placeholder={errors.name ? errors.name.message : "Nome"} />
                    </label>
                    <label className="text-sm grid gap-2" htmlFor="email">
                        Email
                        <Input className={`${errors.email && 'border-red-500'}`} {...register("email")} name="email" placeholder={errors.email ? errors.email.message : "Email"} type="email" autoComplete="email" />
                    </label>
                    <label className="text-sm grid gap-2" htmlFor="cellphone">
                        Cellulare
                        <Input className={`${errors.cellphone && 'border-red-500'}`}  {...register("cellphone")} name="cellphone" placeholder={errors.cellphone ? errors.cellphone.message : "Cellulare"} type="number" autoComplete="cc-number" />
                    </label>
                    <label className="text-sm grid gap-2" htmlFor="street">
                        Estrada
                        <Input className={`${errors.street && 'border-red-500'}`} {...register("street")} name="street" placeholder={errors.street ? errors.street.message : "Estrada (compreso} il numero)"} autoComplete="street-address" />
                    </label>
                    <label className="text-sm grid gap-2" htmlFor="cap">
                        CAP
                        <Input className={`${errors.cap && 'border-red-500'}`}  {...register("cap")} name="cap" placeholder={errors.cap ? errors.cap.message : "cap"} type="number" />
                    </label>
                    <label className="text-sm grid gap-2 flex-1" htmlFor="city">
                        Città
                        <Input className={`${errors.city && 'border-red-500'}`} {...register("city")} name="city" placeholder={errors.city ? errors.city.message : "Città"} />
                    </label>
                    <label className="text-sm grid gap-2 flex-1" htmlFor="complement">
                        Complemento
                        <Input className={`${errors.complement && 'border-red-500'}`} {...register("complement")} name="complement" placeholder={errors.complement ? errors.complement.message : "Complemento"} />
                    </label>

                    <DialogFooter>
                        <Button type="submit" className="w-full">
                            {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Inviare"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}