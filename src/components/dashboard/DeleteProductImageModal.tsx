'use client'

import { deleteProductThumb } from "@/app/actions";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { storage } from "@/services/firebase/firebase.config";
import { Trash } from "@phosphor-icons/react";
import { deleteObject, ref } from "firebase/storage";
import { ReactNode } from "react";
import { toast } from "sonner";


interface Props {
    children: ReactNode;
    onDeleteImage: (fileName: string) => void;
    fileName: string | null;
    id: string;
    newThumbImage: string
}


export function DeleteProductImageModal({ children, onDeleteImage, fileName, id, newThumbImage }: Props) {
    const deleteImage = async () => {
        if (!fileName) return
        const deleteRef = ref(storage, `${id}/${fileName}`);

        if (fileName.startsWith('thumb')) {
            await deleteProductThumb(id, newThumbImage)
        }

        return toast.promise(deleteObject(deleteRef), {
            loading: "Deletando imagem...",
            success: () => {
                onDeleteImage(fileName)
                return "Imagem deletada com sucesso!"
            },
            error: (err) => {
                console.log(err);
                return "Ocorreu um erro ao deletar a imagem!"
            },
        })
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="flex gap-2" onClick={deleteImage}>
                    <Trash />
                    Deletar
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}