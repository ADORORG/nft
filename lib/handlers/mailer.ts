import { createTransport } from 'nodemailer'
import { CustomRequestError } from '../error/request'
import { AppInfo } from '@/lib/app.config'

interface SendEmailType {
    subject: string;
    to: string;
    html: string;
    text: string
}

export default async function sendEmail(mailProp: SendEmailType) {
	const {subject, to, html, text} = mailProp

	const options = {
		port: process.env.EMAIL_SERVER_PORT as string,
		host: process.env.EMAIL_SERVER_HOST as unknown as number,
		auth: {
			user: process.env.EMAIL_SERVER_USER as string,
			pass: process.env.EMAIL_SERVER_PASSWORD as string
		}
	}

	const transporter = createTransport(options as any)

	const result = await transporter.sendMail({
		from:  `${AppInfo.name} <${process.env.EMAIL_FROM}>`,
        subject, 
        to, 
        html, 
        text,
	})
	
	const failed = result.rejected.length > 0;
	if (failed) throw new CustomRequestError('Failed to send email', 500);
}