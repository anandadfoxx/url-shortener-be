import sendEmail from "../smtp_mailer";

export default function sendVerifyAccountEmail(verifyPayload: string, toAddress: string) {
  const baseUrl = (() => {
    switch (process.env.EXPRESS_STATE!) {
      case "production":
        return process.env.PRODUCTION_BASEURL!
      default:
        return process.env.DEVELOPMENT_BASEURL!
    };
  })();

  const link = `${baseUrl}/verify?payload=${verifyPayload}`;

  sendEmail({
    to: toAddress,
    subject: 'URL Shortener Verification',
    message: `Hello our new customer, <br><br>Thanks for registering to our service. Before you using our services, please verify your account into this <a href="${link}">link</a>.<br><br>If is not working, you can paste to your browser.<br>${link}`,
  });
}