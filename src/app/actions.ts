'use server'

export async function addCart(data: any) {
    await fetch('https://fast-store-test.vercel.app/api/cart/add', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
