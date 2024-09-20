'use client'

import { AppleLogo, Headphones, Laptop, ListChecks, WindowsLogo } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { ReactNode } from "react";

interface FilterProps {
    name: string;
    title: string;
    icon: ReactNode
}

const filterOptions: FilterProps[] = [
    { icon: <ListChecks />, name: 'all', title: 'Tutti' },
    { icon: <AppleLogo weight="fill" />, name: 'iphone', title: 'iPhone' },
    { icon: <Headphones weight="fill" />, name: 'headphone', title: 'Cuffie' },
    { icon: <Laptop weight="fill" size={16} />, name: 'notebook', title: 'Notebook' },
    { icon: <WindowsLogo weight="fill" />, name: 'software', title: 'Software' },
    { icon: <AppleLogo weight="fill" />, name: 'accessories', title: 'Accessori' },
]
export function FilterSelector({ handleFilter, currentFilter }: { handleFilter: (filter: string) => void, currentFilter: string }) {
    return (
        <div className="scroller w-full overflow-x-auto snap-x snap-mandatory snap-center scrollbar-hide">
            <RadioGroup className="flex gap-3 text-sm pb-4" defaultValue="all">
                {filterOptions.map(({ name, title, icon }) => (
                    <RadioGroupItem
                        key={name}
                        onClick={() => handleFilter(name)}
                        value={name}
                        checked={currentFilter === name}
                        className="snap-start shrink-0 border flex justify-center gap-1 items-center px-4 py-1 rounded-full transition-colors 
                        duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    >
                        {/* {icon} */}
                        {title}
                    </RadioGroupItem>
                ))}
            </RadioGroup>
        </div>
    )
}
