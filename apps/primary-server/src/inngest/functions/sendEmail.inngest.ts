import { inngest } from "../client.inngest";
import { SendEmail } from "../../services/sendEmail.utils";
import { VerifyEmailTemplate , VERIFY_EMAIL_SUBJECT} from "../../Templates/VerifyEmail.template";

const VerificationEmailSend: ReturnType<typeof inngest.createFunction> = inngest.createFunction(
    { id: "send-email", triggers: [{ event: "EmailVerify/send.email" }] },
    async ({ event, step }) => {
        const message= VerifyEmailTemplate(event?.data?.url!)
        await step.run("SendVerificationEmail", async () => {
            await SendEmail({to:event?.data?.email , subject:VERIFY_EMAIL_SUBJECT , message:message})
        })
    },
);

export { VerificationEmailSend }