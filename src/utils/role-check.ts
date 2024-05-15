import { auth } from "@clerk/nextjs/server";

export function IsAdmin() {
    const { sessionClaims } = auth();
    return sessionClaims?.metadata.role === "admin"
}