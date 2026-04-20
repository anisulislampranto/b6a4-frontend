import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { env } from "@/env";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: env.NEXT_PUBLIC_BACKEND_URL,
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
