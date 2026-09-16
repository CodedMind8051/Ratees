import { type InngestFunction } from "inngest";
import { VerificationEmailSend } from "./functions/sendEmail.inngest";
import { SaveTrendingContentsDataToDBCroneJob } from "./functions/content.inngest"

export { inngest } from "./client.inngest";

export const functions: InngestFunction.Any[] = [
    VerificationEmailSend,
    SaveTrendingContentsDataToDBCroneJob
] as const;