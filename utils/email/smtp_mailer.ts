import nodemailer from 'nodemailer';
import EmailBody from '../../interfaces/email';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default async function sendEmail(body: EmailBody) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: process.env.SMTP_PORT! as unknown as number,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROMADDRESS!,
    subject: body.subject,
    to: body.to,
    cc: body.cc,
    bcc: body.bcc,
    html: body.message
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
    if (err instanceof Error) {
      console.error(`Cannot sent email due to ${err.message}`);
      return;
    }
  })
}