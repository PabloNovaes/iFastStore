import { stripe } from "@/services/stripe/config";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { sessionClaims } = auth();
        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const customers = (await stripe.charges.list()).data.filter(charger => charger.status === "succeeded")
        
        return NextResponse.json(customers)
    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }

}