'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useDropzone } from 'react-dropzone';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { UpadteProductThumb } from "@/app/actions";
import { storage } from "@/services/firebase/firebase.config";
import { CircleNotch, Upload } from "@phosphor-icons/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
    children: ReactNode;
    id: string;
    category: string
    colors?: {
        name: string,
        code: string,
        available: boolean
    }[]

    handleUploadImages: (data: { name: string, url: string }[]) => void
    imagesCount: number
}

export function UploadImage({ children, colors, id, handleUploadImages, imagesCount, category }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([])

    const {
        getRootProps,
        acceptedFiles,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 4,
        onDropAccepted: (files) => setFiles(files.reverse())
    });


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const form = new FormData(e.target as HTMLFormElement)

        try {
            setIsLoading(true)
            const colorAssociation = form.get("color")
            const imagesURLs: { name: string, url: string }[] = []

            for await (const file of files) {
                let fileName

                if (file.name === files[files.length - 1].name) {
                    fileName = `thumb-${colorAssociation}-${file.name}`
                } else {
                    fileName = `${colorAssociation}-${file.name}`
                }

                const path = ref(storage, `${id}/${fileName}`)

                const upload = await uploadBytes(path, file)
                const url = await getDownloadURL(upload.ref)

                imagesURLs.push({ name: file.name, url })
            }

            if (imagesCount === 0) {
                await UpadteProductThumb({ id, url: imagesURLs[imagesURLs.length - 1].url })
            }

            toast.success("Arquivos enviados!")
            return handleUploadImages(imagesURLs)
        } catch (err) {
            toast.success("Ocorreu um erro inesperado!")
            throw err
        } finally {
            setOpen(false)
            setFiles([])
            return setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">Adicionar imagens do produto</DialogTitle>
                </DialogHeader>
                <form className="grid gap-2" onSubmit={async (event) => await handleSubmit(event)}>
                    {category !== "software" && (
                        <label className="text-sm grid gap-2" htmlFor="files">
                            Associação
                            <Select name="color" required>
                                <SelectTrigger id="category" aria-label="Select category">
                                    <SelectValue placeholder="Associe as imagens a uma cor do produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category !== "software" && colors && colors.map(({ code, name }) => (
                                        <SelectItem value={name} key={name}>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full size-6 shadow-inner shadow-black/50 border-2" style={{ background: code }}></span>
                                                {name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>
                    )}
                    <label className="text-sm grid gap-2" htmlFor="files">
                        <div className="flex flex-col gap-4">
                            <div
                                {...getRootProps()}
                                className={`border-dashed border-2 min-h-[88px] ${isDragAccept ? 'border-blue-400 bg-primary-foreground brightness-105' : 'border'} min-h-[60px] rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 w-full p-4`}
                            >
                                <Input id="fileUpload"
                                    {...getInputProps()}
                                    className="hidden"
                                />
                                {isDragAccept && (
                                    <span className="flex flex-col items-center gap-3 ites-center">
                                        <Upload className="w-5 h-5" />
                                        <p className="text-sm ">Drop file here...</p>
                                    </span>
                                )}
                                {isDragReject && (<p>Arquivo de tipo incompativel!</p>)}
                                {!isDragActive && (
                                    <span className="flex flex-col items-center gap-3 ites-center">
                                        {isLoading ?
                                            <>
                                                <p className="text-sm ">Enviando...</p>
                                            </>
                                            : <>
                                                <Upload className="w-5 h-5" />
                                                {acceptedFiles.length === 0 && <p className="text-sm ">Solte as imagens aqui...</p>}
                                                {acceptedFiles.length === 1 && <p className="text-sm ">1 Arquivo selecionado</p>}
                                                {acceptedFiles.length > 1 && <p className="text-sm ">{`${acceptedFiles.length} Arquivos selecionados`}</p>}
                                            </>
                                        }
                                    </span>
                                )}


                            </div>
                        </div>
                    </label>
                    <DialogFooter>
                        <Button variant={'outline'} onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit">
                            {isLoading ? <CircleNotch size={22} className="animate-spin" /> : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}