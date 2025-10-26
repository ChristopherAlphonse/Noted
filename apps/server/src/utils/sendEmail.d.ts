import type { ReactElement } from 'react';
interface SendEmailOptions {
    subject: string;
    send_to: string;
    sent_from: string;
    reply_to?: string;
    template: ReactElement;
}
declare const sendEmail: (options: SendEmailOptions) => Promise<void>;
export default sendEmail;
//# sourceMappingURL=sendEmail.d.ts.map