"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { Separator } from "@radix-ui/react-separator";

export function Loading() {
    return (
        <main className="p-5 flex flex-col gap-4 max-w-5xl m-auto" style={{ minHeight: 'calc(100svh - 50px)' }}>
            <div className="flex items-center gap-3 bg-muted/40 border rounded-2xl p-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <span>
                    <Skeleton className="rounded-md h-4 w-32 mb-2" />
                    <Skeleton className="rounded-md h-4 w-48" />
                </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-4 h-full flex-wrap flex-3 w-full">
                    <Tabs defaultValue="tab1" className="flex-[2] md:min-w-[416px] h-fit">
                        <TabsList className="grid w-full grid-cols-4 h-fit rounded-xl border">
                            {[1, 2, 3, 4].map((tab) => (
                                <TabsTrigger key={tab} value={`tab${tab}`} className="tab-trigger flex-col rounded-lg relative">
                                    <Skeleton className="rounded-md h-6 w-6 mb-1" />
                                    <Skeleton className="rounded-md h-4 w-16" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {[1, 2, 3, 4].map((tab) => (
                            <TabsContent key={tab} value={`tab${tab}`} className="data-[state=inactive]:mt-0 grid gap-2 h-fit mt-4">
                                {[1, 2].map((item) => (
                                    <Accordion key={item} type="single" collapsible className="border h-fit px-2 rounded-xl w-full bg-muted/40">
                                        <AccordionItem value={`item${item}`}>
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="rounded-md h-12 w-12 " />
                                                    <div>
                                                        <Skeleton className="rounded-md h-4 w-32 mb-2" />
                                                        <Skeleton className="rounded-md h-3 w-24" />
                                                    </div>
                                                </div>
                                                <Skeleton className="rounded-md h-8 w-24" />
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
                <Card className="rounded-xl md:max-w-72 w-full h-fit text-sm overflow-auto">
                    <CardHeader className="dark:bg-zinc-950/50 bg-muted/40 flex flex-row items-center justify-between">
                        <CardTitle className="font-semibold text-lg">
                            <Skeleton className="rounded-md h-6 w-32" />
                        </CardTitle>
                        <Skeleton className="rounded-md h-8 w-8" />
                    </CardHeader>
                    <CardContent className="space-y-6 mt-4">
                        <div>
                            <Skeleton className="rounded-md h-5 w-40 mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="rounded-md h-4 w-full" />
                                <Skeleton className="rounded-md h-4 w-full" />
                                <Skeleton className="rounded-md h-4 w-3/4" />
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <Skeleton className="rounded-md h-5 w-24 mb-2" />
                            <dl className="grid gap-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex justify-between">
                                        <Skeleton className="rounded-md h-4 w-20" />
                                        <Skeleton className="rounded-md h-4 w-32" />
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}