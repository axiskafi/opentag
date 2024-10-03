import { API_URL, POST_URL } from "@/lib/apiEndPoints"

export async function fetchPosts(token: string) {
    let data = await fetch(API_URL + POST_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!data.ok) {
        throw new Error('Failed to fetch data')
    }
    //let posts = await data.json()
    return data.json();
}