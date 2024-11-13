import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

import { AdressProps } from "@/app/api/adresses/route";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateAdressSchema, createAdressSchema } from "./CreateAdressForm";

interface CreateAdressFormProps {
    children: ReactNode;
    currentData: AdressProps;
    onSubmit: (data: CreateAdressSchema) => Promise<void>;
}

export function UpdateAddressForm({ onSubmit, children, currentData }: CreateAdressFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAdressSchema>({
        resolver: zodResolver(createAdressSchema),
    })

    const { cap, cellphone, city, email, name, street, complement } = currentData

    const isMobile = useMediaQuery('(max-width: 640px)');

    const formContent = (
        <form onSubmit={handleSubmit((data: CreateAdressSchema) => {
            setIsLoading(true)
            onSubmit(data).then(() => { })
                .finally(() => {
                    setIsLoading(false)
                    setOpen(false)
                })
        })} className="h-full grid items-end" style={{ gridTemplateRows: "min-content 1fr" }}>
            <div className="grid gap-2">
                <label className="text-sm grid gap-2" htmlFor="name">
                    Nome
                    <Input {...register("name")} defaultValue={name} className={cn("h-10 bg-muted/40", errors.name && 'border-red-500')}
                        type="text" name="name" autoComplete="name" placeholder={errors.name ? errors.name.message : "Nome"} />
                </label>
                <label className="text-sm grid gap-2" htmlFor="email">
                    Email
                    <Input {...register("email")} defaultValue={email} className={cn("h-10 bg-muted/40", errors.email && 'border-red-500')}
                        name="email" placeholder={errors.email ? errors.email.message : "Email"} type="email" autoComplete="email" />
                </label>
                <label className="text-sm grid gap-2" htmlFor="cellphone">
                    Cellulare
                    <Input {...register("cellphone")} defaultValue={cellphone} className={cn("h-10 bg-muted/40", errors.cellphone && 'border-red-500')}
                        name="cellphone" placeholder={errors.cellphone ? errors.cellphone.message : "Cellulare"} type="number" autoComplete="cc-number" />
                </label>
                <label className="text-sm grid gap-2" htmlFor="street">
                    Strada
                    <Input {...register("street")} defaultValue={street} className={cn("h-10 bg-muted/40", errors.street && 'border-red-500')}
                        name="street" placeholder={errors.street ? errors.street.message : "Estrada (compreso} il numero)"} autoComplete="street-address" />
                </label>
                <div className="grid gap-2 grid-cols-3">
                    <label className="text-sm grid gap-2 flex-1 col-span-2" htmlFor="city">
                        Città
                        <Input {...register("city")} defaultValue={city} className={cn("h-10 bg-muted/40", errors.city && 'border-red-500')}
                            name="city" placeholder={errors.city ? errors.city.message : "Città"} />
                    </label>
                    <label className="text-sm grid gap-2" htmlFor="cap">
                        CAP
                        <Input {...register("cap")} defaultValue={cap} className={cn("h-10 bg-muted/40", errors.cap && 'border-red-500')}
                            name="cap" placeholder={errors.cap ? errors.cap.message : "cap"} type="number" />
                    </label>
                </div>
                <label className="text-sm grid gap-2 flex-1" htmlFor="complement">
                    Complemento
                    <Input {...register("complement")} defaultValue={complement ?? ""} className={cn("h-10 bg-muted/40", errors.complement && 'border-red-500')}
                        name="complement" placeholder={errors.complement ? errors.complement.message : "Complemento"} />
                </label>
            </div>

            <Button type="submit" className="w-full mt-2">
                {isLoading ? <Spinner size={22} className="animate-spin" /> : "Inviare"}
            </Button>
        </form>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent className="p-5 h-[80%]">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Modifica indirizzo</DrawerTitle>
                    </DrawerHeader>
                    {formContent}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Modifica indirizzo</DialogTitle>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
}