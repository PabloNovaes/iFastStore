import { NextRequest } from "next/server";
import { db } from "../../../../../prisma/client";

export async function DELETE(req: NextRequest) {
    try {
        const { id, userId } = await req.json() as { id: string, userId: string }
        
        const deleted = await db.shoppingCart.deleteMany({ where: { id, userId } })

        return Response.json({ deletedProduct: deleted })
    } catch (err) {
        console.log('erro', err)
    }
}