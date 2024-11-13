import { stripe } from "@/services/stripe/config";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Adresses } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "../../../../../../prisma/client";

export async function GET() {
    try {
        const { sessionClaims } = auth();
        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const [usersData, customersData] = await Promise.all([clerkClient.users.getUserList(), stripe.customers.list()])

        const users = [] as { name: string, email: string, adress: Adresses, isBuyer: boolean, created_at: number }[]

        for (let user of usersData.data) {
            const { id, primaryEmailAddress, firstName, lastName, createdAt } = user

            const adress = await db.adresses.findMany({ where: { userId: id } })
            users.push({ name: `${firstName} ${lastName}` as string, email: primaryEmailAddress?.emailAddress as string, adress: adress[0], isBuyer: false, created_at: createdAt })
        }
        const data = [
            ...users, ...customersData.data.map(({ name, email, created }) => ({
                name,
                email,
                adress: users.find(user => user.email === email)?.adress,
                isBuyer: true,
                created_at: created
            }))
        ]
console.log(users);

        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }

}