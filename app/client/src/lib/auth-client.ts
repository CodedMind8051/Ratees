import { createAuthClient } from "better-auth/react"
import {
    inferOrgAdditionalFields,
    organizationClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000",
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields(),
        }),]
})