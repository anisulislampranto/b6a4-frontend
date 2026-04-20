import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { API_BASE_URL } from "@/services/api-base";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: API_BASE_URL,
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
