import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TemplateRenderer {
    constructor() {
        this.templatesDir = path.join(__dirname, '../templates/emails');
        this.templateCache = new Map();
        this.clientUrl = process.env.CLIENT_URL || 'http://noospherehub.net';
        this.controlPanelUrl = process.env.CONTROL_PANEL_URL || `${this.clientUrl}/control`;
        this.tenantUrl = process.env.TENANT_URL || `${this.clientUrl}/tenant`;
        this.clientPortalUrl = process.env.CLIENT_PORTAL_URL || `${this.clientUrl}/client`;
    }

    loadTemplate(templateName) {
        const cacheKey = templateName;

        // Check cache first
        if (this.templateCache.has(cacheKey)) {
            return this.templateCache.get(cacheKey);
        }

        // Add .html extension if not present
        const fileName = templateName.endsWith('.html') ? templateName : `${templateName}.html`;
        const templatePath = path.join(this.templatesDir, fileName);

        try {
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            // Cache the template
            this.templateCache.set(cacheKey, templateContent);
            return templateContent;
        } catch (error) {
            throw new Error(`Template '${templateName}' not found at ${templatePath}`);
        }
    }

    render(templateName, variables = {}) {
        const template = this.loadTemplate(templateName);
        // Inject URL variables
        const baseVariables = {
            clientUrl: this.clientUrl,
            controlPanelUrl: this.controlPanelUrl,
            tenantUrl: this.tenantUrl,
            clientPortalUrl: this.clientPortalUrl,
            ...variables
        };
        return this.injectVariables(template, baseVariables);
    }

    injectVariables(template, variables) {
        let rendered = template;

        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            rendered = rendered.replace(regex, value || '');
        }

        return rendered;
    }

    clearCache() {
        this.templateCache.clear();
    }
}

// Export a singleton instance
const templateRenderer = new TemplateRenderer();

export default templateRenderer;