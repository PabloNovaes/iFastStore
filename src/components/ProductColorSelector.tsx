'use client'

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

interface ProductColorSelectorProps {
    colors: { name: string, code: string, available: boolean }[];
    handleSetActiveColor: (name: string) => void;
    inStock: boolean
    modelCount: number
    hasModelSelected: string | null
}

export function ProductColorSelector({ colors, handleSetActiveColor, inStock, hasModelSelected, modelCount }: ProductColorSelectorProps) {
    if (!colors) return

    return (
        <RadioGroup className="gap-2 flex color-selector" name="color" required>
            {modelCount > 1 ?
                colors.map(({ name, code, available }) => {
                    return (
                        <RadioGroupItem disabled={!available || !inStock || hasModelSelected === null} style={{ background: code }} key={name} id={name} value={name} onClick={() => handleSetActiveColor(name)}
                            className="radio-item overflow-hidden rounded-full size-6 shadow-inner shadow-black/50 border-2 data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative">
                            {/* <span id="disabled"></span> */}
                        </RadioGroupItem>
                    )
                })
                :
                colors.map(({ name, code, available }) => {
                    return (
                        <RadioGroupItem disabled={!inStock || !available} style={{ background: code }} key={name} id={name} value={name} onClick={() => handleSetActiveColor(name)}
                            className="radio-item overflow-hidden rounded-full size-6 shadow-inner shadow-black/50 border-2 data-[state=checked]:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative">
                            {/* <span id="disabled"></span> */}
                        </RadioGroupItem>
                    )
                })
            }
        </RadioGroup>
    )
}