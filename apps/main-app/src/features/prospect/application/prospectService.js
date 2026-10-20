import MailService from '../../../utilities/nodemailer.js';
import templateRenderer from '../../../utilities/templateRenderer.js';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

class ProspectService {
    async sendEmail({ to, subject, body }) {
        const html = templateRenderer.render('prospect-email.html', {
            subject: escapeHtml(subject),
            body: escapeHtml(body).replace(/\r?\n/g, '<br>'),
        });

        const attachments = [{
            filename: 'Logowrap.png',
            path: 'Logowrap.png',
            cid: 'unique@image',
            contentType: 'image/png',
        }];

        const result = await MailService.sendMail(to, subject, body, html, attachments);

        if (!result.success) {
            throw new Error('Failed to send prospect email');
        }

        return { messageId: result.messageId };
    }
}

export default ProspectService;
