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

  static async sendMail(to, subject, text, html = null, attachments = null) {
    try {
      const mailOptions = {
        from: '"Noosphere" <ayodejiamzat@gmail.com>',
        to,
        subject,
        ...(text && { text }),
        ...(html && { html }),
        ...(attachments && { attachments })
      };
console.log(mailOptions)
      const info = await MailService.transporter.sendMail(mailOptions);

      if (!info.accepted.includes(to)) {
        throw new Error("Failed to send mail");
      }
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return "Failed to send email: " + error.message;
    }
  }
}

export default MailService;