import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL

const getSession = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${AUTH_URL}/get-session`, {
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: "no-store"
        })
        const session = await res.json();

        if (session?.data === null) {
            return {
                data: null,
                error: {
                    message: 'Session is missing!'
                }
            }
        }

        return {
            data: session,
            error: null
        }
    } catch (error) {
        console.error(error)
        return {
            data: null,
            error: {
                message: 'Something went wrong!'
            }
        }
    }
}


export const userService = {
    getSession
}