import { type InngestFunction } from "inngest";
import { VerificationEmailSend } from "./functions/sendEmail.inngest";

export { inngest } from "./client.inngest";

export const functions: InngestFunction.Any[] = [
    VerificationEmailSend
] as const;