import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/client";

export const dynamic = 'force-dynamic'

export interface AdressProps {
    id?: string
    complement?: string
    city: string
    cap: number
    street: string
    userId: string
    name: string
    cellphone: string
    email: string
}
export async function POST(req: NextRequest) {
    try {
        const data = await req.json() as AdressProps
        const adress = await db.adresses.create({ data })

        return NextResponse.json(adress)
    } catch (err) {
        console.log(err);
        
        return NextResponse.json({ message: err, code: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json() as AdressProps
        const adress = await db.adresses.update({
            where: { id: data.id },
            data
        })

        return NextResponse.json(adress)
    } catch (err) {
        return NextResponse.json({ message: err, code: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId') as string
        const adress = await db.adresses.findMany({ where: { userId } })

        return NextResponse.json(adress)
    } catch (err) {
        return NextResponse.json({ message: err, code: 500 })
    }
}