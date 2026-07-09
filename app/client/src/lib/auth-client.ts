import { createAuthClient } from "better-auth/react"
import {
    inferOrgAdditionalFields,
    organizationClient,
} from "better-auth/client/plugins";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields(),
        }),]
})

// Helper to manually set the cookie for better-auth if needed
export async function refreshSession() {
    try {
        const session = await authClient.getSession();
        return session;
    } catch (error) {
        console.error('Failed to refresh session:', error);
        return null;
    }
} 