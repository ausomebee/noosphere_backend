// import notificationConfig from "../config/notifications.json";
import fs from "fs";

const notificationConfig = JSON.parse(
  fs.readFileSync(new URL("../config/notifications.json", import.meta.url))
);

class NotificationProcessor {
  constructor({ notificationService, emailService, io }) {
    this.notificationService = notificationService;
    this.emailService = emailService;
    this.io = io;
  }

  async process(data) {
    const { type, userId, userType } = data;

    const config = notificationConfig[type];

    if (!config) {
      throw new Error(`Notification type ${type} not defined`);
    }

    if (config.conditions?.userType &&
        config.conditions.userType !== userType) {
      return;
    }

    let savedNotification = null;

    if (config.channels.includes("in_app")) {
      savedNotification = await this.notificationService.createNotification(data);

      const room = `${userType}_${userId}`;
      this.io.to(room).emit("newNotification", {
        notification: savedNotification
      });
    }

    if (config.channels.includes("email")) {
      await this.sendEmail(config.emailTemplate, data);
    }

    return savedNotification;
  }

  async sendEmail(templateName, data) {
    const html = await this.buildTemplate(templateName, data);

    const result = await this.emailService.sendTenantEmail({
      tenantSlug: data.tenantSlug,
      to: [data.email],
      subject: data.subject,
      html
    });

    if (!result?.messageId) {
      throw new Error("Email failed");
    }
  }

  async buildTemplate(templateName, data) {
    switch (templateName) {
      case "welcomeTenant":
        return `<h1>Welcome ${data.name}</h1>`;
      case "paymentSuccess":
        return `<h1>Payment Successful</h1>`;
      default:
        return `<h1>Notification</h1>`;
    }
  }
}

export default NotificationProcessor;