import { type InngestFunction } from "inngest";
import { VerificationEmailSend } from "./functions/sendEmail.inngest";
import {fetchContentsInfo} from "./functions/searchContent.inngest"

export { inngest } from "./client.inngest";

export const functions: InngestFunction.Any[] = [
    VerificationEmailSend,
    fetchContentsInfo
] as const;