'use client'

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

interface FilterProps {
    name: string;
    title: string;
}

const filterOptions: FilterProps[] = [
    { name: 'all', title: 'All' },
    { name: 'iphone', title: 'iPhones' },
    { name: 'airpods', title: 'AirPods' },
    { name: 'notebook', title: 'Notebooks' }
]
export function FilterSelector({ handleFilter }: { handleFilter: (filter: string) => void }) {
    return (
        <>
            <RadioGroup className="filter-selector flex gap-3 text-sm flex-1" defaultValue="all">
                {filterOptions.map(({ name, title }) => (
                    <RadioGroupItem key={name} onClick={() => handleFilter(name)} value={name} className="border px-4 py-1 rounded-2xl transition-colors duration-300 data-[state=checked]:bg-primary data-[state=checked]:text-white" >{title}</RadioGroupItem>
                ))}
            </RadioGroup>
        </>
    )
}