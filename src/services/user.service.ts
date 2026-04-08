import { env } from "@/env";
import { cookies } from "next/headers";
import { requestJSON } from "./http.service";

const AUTH_URL = env.AUTH_URL

interface SessionResponse {
    data: unknown | null;
    [key: string]: unknown;
}

const getSession = async () => {
    try {
        const cookieStore = await cookies();
        const session = await requestJSON<SessionResponse>(`${AUTH_URL}/get-session`, {
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: "no-store"
        })

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
