import type { emailInput } from "../types/email.types"
import { Resend } from 'resend';


const resend = new Resend(process.env.Resend_ApiKey as string);

export const SendEmail = async ({ to, subject, message }: emailInput) => {
    try {
        if (!process.env.Resend_ApiKey) {
            throw new Error("Resend API key is not configured");
        }

        const { data, error } = await resend.emails.send({
            from: 'Ratees <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: message,
        });

        if (error) {
            return console.error({ error });
        }

        return { success: true, data };

    } catch (error) {
        console.error({ error });
    }
}