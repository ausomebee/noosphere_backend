import nodemailer from "nodemailer";

class MailService {
  static transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  static async sendMail(to, subject, text, html = null) {
    try {
      const mailOptions = {
        from: '"LedihRide" <ayodejiamzat@gmail.com>',
        to,
        subject,
        text,
        ...(html && { html }),
      };

      const info = await MailService.transporter.sendMail(mailOptions);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return "Failed to send email: " + error.message;
    }
  }
}

export default MailService;