import { createAuthClient } from "better-auth/react"
import {
    inferOrgAdditionalFields,
    organizationClient,
} from "better-auth/client/plugins";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields(),
        }),]
}) 