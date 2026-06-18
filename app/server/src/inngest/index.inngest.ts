import { type InngestFunction } from "inngest";
import { VerificationEmailSend } from "./functions/sendEmail.inngest";
import { SaveContentsDataToDBJob, SaveTrendingContentsDataToDBCroneJob } from "./functions/content.inngest"

export { inngest } from "./client.inngest";

export const functions: InngestFunction.Any[] = [
    VerificationEmailSend,
    SaveContentsDataToDBJob,
    SaveTrendingContentsDataToDBCroneJob
] as const;