'use server'

export async function addCart(data: any) {
    await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
