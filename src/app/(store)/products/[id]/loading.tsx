import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <main className=" max-w-5xl m-auto py-4 px-4 main-height">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-8">
                <div className="grid gap-6">
                    <div className="rounded-[30px] min-h-[262px] ">
                        <Skeleton className="w-full h-full rounded-[20px]" />
                    </div>
                    <ul className="grid w-full gap-2 grid-cols-4">
                        <Skeleton className="w-full h-[100px] rounded-[20px]" />
                        <Skeleton className="w-full h-[100px] rounded-[20px]" />
                        <Skeleton className="w-full h-[100px] rounded-[20px]" />
                        <Skeleton className="w-full h-[100px] rounded-[20px]" />
                    </ul>

                </div>
                <div className="grid gap-8">
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-full max-w-64" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <div className="flex flex-col justify-between gap-6">
                        <Skeleton className="h-7 w-full max-w-56" />
                        <Skeleton className="h-7 w-24" />
                    </div>
                    <Skeleton className="h-7 max-w-56 w-full" />
                    <div className="flex flex-col justify-between gap-6">
                        <Skeleton className="h-[74px] w-full rounded-2xl" />
                        <Skeleton className="h-[74px] w-full rounded-2xl" />
                    </div>

                    <div className="flex justify-between gap-8">
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <Skeleton className="h-14 w-24 rounded-xl" />
                    </div>
                    {/* <span className=" animate-pulse rounded-lg bg-accent h-[30px]"></span>
                    <span className=" animate-pulse rounded-lg bg-accent h-[24px]"></span>
                    <span className=" animate-pulse rounded-lg bg-accent h-[24px]"></span>
                    <div className="h-full flex flex-col gap-4 h">
                        <span className=" animate-pulse rounded-lg bg-accent h-[24px]"></span>
                        <span className=" animate-pulse rounded-lg bg-accent h-[58px]"></span>
                        <span className=" animate-pulse rounded-lg bg-accent h-[58px]"></span>
                    </div> */}
                </div>
            </div>
        </main>
    )
}