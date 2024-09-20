'use client'

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

interface ProductColorSelectorProps {
    colors: { name: string, code: string, available: boolean }[];
    handleSetActiveColor: (name: string) => void;
    inStock: boolean
    modelCount: number
    hasModelSelected: string
}

export function ProductColorSelector({ colors, handleSetActiveColor, inStock, hasModelSelected, modelCount }: ProductColorSelectorProps) {
    if (!colors) return

    return (
        <RadioGroup className="gap-2 flex flex-wrap color-selector radio-group" name="color">
            {modelCount > 1 ?
                colors.map(({ name, code, available }) => {
                    return (
                        <RadioGroupItem disabled={!available || !inStock || hasModelSelected === null} key={name} id={name} value={name} onClick={() => handleSetActiveColor(name)}
                            className="border rounded-full shadow-sm p-1 px-2 flex gap-2 items-center radio-item overflow-hidden  data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative">
                            <div className="rounded-full size-4 shadow-black/50 shadow-inner" style={{ background: code }}></div>
                            <span className="text-sm select-none">{name}</span>
                            <span id="disabled"></span>
                        </RadioGroupItem>
                    )
                })
                :
                colors.map(({ name, code, available }) => {
                    return (
                        <RadioGroupItem disabled={!inStock || !available}  key={name} id={name} value={name} onClick={() => handleSetActiveColor(name)}
                            className="border rounded-full shadow-sm p-1 px-2 flex gap-2 items-center radio-item overflow-hidden  data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative">
                            <div className="rounded-full size-4 shadow-black/50 shadow-inner" style={{ background: code }}></div>
                            <span className="text-sm select-none">{name}</span>
                            <span id="disabled"></span>
                        </RadioGroupItem>
                    )
                })
            }
        </RadioGroup>
    )
}