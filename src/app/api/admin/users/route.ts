import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { sessionClaims } = auth();
        if (sessionClaims?.metadata.role !== "admin") return NextResponse.json("You are not authorized")

        const users = await clerkClient.users.getUserList()

        return NextResponse.json(users.data)
    } catch (err) {
        return NextResponse.json({ message: "Ocurred unspected error on server" }, { status: 500 })
    }

}