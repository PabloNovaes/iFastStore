
import { Skeleton } from "@/components/ui/skeleton"
export function ProductCardSkeleton() {
    return (
        <div className="grid gap-4 max-w-[290px]">
            <Skeleton className="h-[175px] rounded-[30px]" />
            <Skeleton className="h-5 max-w-[30%] rounded-md" />
            <Skeleton className="h-6 max-w-[70%] rounded-md" />
            <Skeleton className="h-5 max-w-[40%] rounded-md" />
        </div>
    )
}