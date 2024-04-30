'use client'

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { ColorProps } from "./ProductCard";

interface ProductColorSelectorProps {
    colors: ColorProps[];
    handleSetActiveColor: (name: string) => void;
}

export function ProductColorSelector({ colors, handleSetActiveColor }: ProductColorSelectorProps) {

    return (
        <RadioGroup className="gap-2 flex color-selector" defaultValue={colors[0].name} name="color">
            {colors.map(({ name, code }) => {
                return (
                    <RadioGroupItem style={{ background: code }} key={name} id={name} value={name} onClick={() => handleSetActiveColor(name)}
                        className="rounded-full size-6 shadow-inner shadow-black/50 border-2 data-[state=checked]:border-blue-400 transition-all"></RadioGroupItem>
                )
            })}
        </RadioGroup>
    )
}