'use client'

import { deleteProductThumb } from "@/app/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { storage } from "@/services/firebase/firebase.config";
import { deleteObject, ref } from "firebase/storage";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface Props {
    children: ReactNode;
    onDeleteImage: (fileName: string) => void;
    fileName: string | null;
    id: string
}

export function DeleteProductImageModal({ children, onDeleteImage, fileName, id }: Props) {
    const [isLoading, setIsLoading] = useState(false)

    const deleteImage = async () => {
        try {
            if (!fileName) return
            setIsLoading(true)

            const deleteRef = ref(storage, `${id}/${fileName}`);

            await deleteObject(deleteRef)
           
            if (fileName.startsWith('thumb')) {
                await deleteProductThumb(id)
            }

            onDeleteImage(fileName)
            return toast.success("Arquivo deletado!")
        } catch (err) {
        } finally {
            return setIsLoading(false)
        }

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={async () => await deleteImage()}>
                    Deletar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}