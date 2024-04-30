import { verifyToken } from "@clerk/nextjs/server";

export async function decodeToken(token: string) {
    const { sub } = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
    })
    return sub
}