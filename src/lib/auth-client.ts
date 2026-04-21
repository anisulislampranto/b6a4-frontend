import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: typeof window !== "undefined" ? window.location.origin : "",
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                    required: false,
                    input: true,
                },
            },
        }),
    ],
})
