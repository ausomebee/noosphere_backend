import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

class ClinicalReportPdfGenerator {
    constructor() {
        // Page dimensions and margins
        this.pageWidth = 595.28; // A4 width in points
        this.pageHeight = 841.89; // A4 height in points
        this.margin = {
            top: 50,
            bottom: 60,
            left: 50,
            right: 50
        };
        this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;

        // Colors
        this.colors = {
            confidential: '#999999',
            primary: '#2C3E50',
            secondary: '#34495E',
            label: '#2C3E50',
            text: '#4A4A4A',
            lightGray: '#F5F5F5',
            border: '#E0E0E0'
        };

        // Typography
        this.fonts = {
            heading1: { size: 24, font: 'Helvetica-Bold' },
            heading2: { size: 14, font: 'Helvetica-Bold' },
            heading3: { size: 12, font: 'Helvetica-Bold' },
            label: { size: 10, font: 'Helvetica-Bold' },
            body: { size: 10, font: 'Helvetica' },
            small: { size: 8, font: 'Helvetica' }
        };
    }

    async generatePdf({ report, sections }) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: this.margin,
                    bufferPages: true,
                    info: {
                        Title: report.title || 'Clinical Report',
                        Author: report.tenant?.companyName || 'NooSphere ABA PMS',
                        Subject: 'Clinical Report',
                        Keywords: 'clinical, report, ABA'
                    }
                });

                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    resolve(pdfBuffer);
                });
                doc.on('error', reject);

                // Generate content
                this.renderDocument(doc, report, sections);

                // Add page numbers and footer to all pages
                this.addPageNumbers(doc);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    renderDocument(doc, report, sections) {
        // Page 1: Header and Client Information
        this.renderHeader(doc, report);
        this.renderDocumentTitle(doc, report.title || 'Behaviour Intervention Plan');

        // Render each section
        sections.forEach((section, index) => {
            if (section.section === 'Client Information') {
                this.renderClientInformation(doc, section.content, report);
            } else if (section.section === 'Assessments') {
                this.renderAssessments(doc, section.content);
            }
            // Add more section handlers as needed
        });
    }

    renderHeader(doc, report) {
        const y = this.margin.top - 30;

        // "Confidential" text centered at top
        doc.fontSize(10)
            .fillColor(this.colors.confidential)
            .font('Helvetica')
            .text('Confidential', this.margin.left, y, {
                width: this.contentWidth,
                align: 'center'
            });

        // Client name on left
        const clientName = this.getClientFullName(report);
        doc.fontSize(10)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text(`Client Name ${clientName}`, this.margin.left, y + 25);

        // Company info on right
        const rightX = this.pageWidth - this.margin.right - 200;
        const tenant = report.tenant;

        doc.fontSize(10)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text('Tenant Company', rightX, y + 25, { width: 120 });

        doc.fontSize(8)
            .fillColor(this.colors.text)
            .font('Helvetica')
            .text(tenant?.email || 'email@example.com', rightX, y + 40, { width: 120 });

        if (tenant?.phoneNumber) {
            doc.text(`+${tenant.phoneNumber}`, rightX, y + 52, { width: 120 });
        }

        // Address
        if (tenant?.location) {
            const loc = tenant.location;
            const address = `${loc.address || ''}, ${loc.city || ''}, ${loc.stateProvince || ''}, ${loc.country || ''}`;
            doc.fontSize(7)
                .text(address, rightX, y + 64, { width: 120 });
        }

        // Logo placeholder (you can add actual logo loading here)
        const logoX = this.pageWidth - this.margin.right - 50;
        doc.circle(logoX + 20, y + 50, 20)
            .fillColor('#E8F4F8')
            .fill();
        doc.fillColor(this.colors.primary)
            .fontSize(8)
            .text('ABA', logoX + 10, y + 45);
        doc.fontSize(6)
            .text('PRACTICE', logoX + 5, y + 55);

        // Reset position for content
        doc.y = y + 110;
    }

    renderDocumentTitle(doc, title) {
        doc.moveDown(1);
        doc.fontSize(this.fonts.heading1.size)
            .fillColor(this.colors.primary)
            .font(this.fonts.heading1.font)
            .text(title, this.margin.left, doc.y, {
                width: this.contentWidth,
                align: 'center'
            });
        doc.moveDown(2);
    }

    renderSectionHeader(doc, title) {
        // Add some space before section
        if (doc.y > 150) {
            doc.moveDown(1);
        }

        doc.fontSize(this.fonts.heading2.size)
            .fillColor(this.colors.primary)
            .font(this.fonts.heading2.font)
            .text(title.toUpperCase(), {
                continued: false
            });
        doc.moveDown(0.5);
    }

    renderField(doc, label, value, options = {}) {
        const y = doc.y;

        // Check if we need a new page
        if (y > this.pageHeight - this.margin.bottom - 50) {
            doc.addPage();
        }

        // Render label
        doc.fontSize(this.fonts.label.size)
            .fillColor(this.colors.label)
            .font(this.fonts.label.font)
            .text(label + ':', {
                continued: true
            });

        // Render value
        doc.fontSize(this.fonts.body.size)
            .fillColor(this.colors.text)
            .font(this.fonts.body.font)
            .text(' ' + (value || 'N/A'), {
                continued: false
            });

        if (!options.noSpace) {
            doc.moveDown(0.3);
        }
    }

    renderParagraph(doc, label, content) {
        const y = doc.y;

        // Check if we need a new page
        if (y > this.pageHeight - this.margin.bottom - 100) {
            doc.addPage();
        }

        // Render label
        doc.fontSize(this.fonts.label.size)
            .fillColor(this.colors.label)
            .font(this.fonts.label.font)
            .text(label + ':', {
                continued: false
            });

        // Render paragraph content
        doc.fontSize(this.fonts.body.size)
            .fillColor(this.colors.text)
            .font(this.fonts.body.font)
            .text(this.stripHtml(content), {
                align: 'left',
                lineGap: 2
            });

        doc.moveDown(0.5);
    }

    renderClientInformation(doc, content, report) {
        this.renderSectionHeader(doc, 'Client Information');

        // Client full name
        this.renderField(doc, 'Input Label (Client Name)',
            `Body Text (${content.clientFullName || 'N/A'})`);

        // Date of birth
        this.renderField(doc, 'Date of Birth', content.dateOfBirth || 'N/A');

        // Gender
        this.renderField(doc, 'Gender', content.gender || 'N/A');

        // Client age (calculated if DOB is available)
        if (content.dateOfBirth) {
            const age = this.calculateAge(content.dateOfBirth);
            this.renderField(doc, 'Client age', age);
        }

        // Client background
        if (content.clientBackground) {
            doc.moveDown(0.5);
            this.renderParagraph(doc, 'Client background', content.clientBackground);
        }

        // Diagnoses
        if (content.diagnoses && content.diagnoses.length > 0) {
            doc.moveDown(1);
            content.diagnoses.forEach((diagnosis, index) => {
                if (index > 0) {
                    doc.moveDown(1);
                }

                this.renderField(doc, 'Diagnosis name', diagnosis.diagnosisName || 'N/A');
                this.renderField(doc, 'Diagnosis Code', diagnosis.diagnosisCode || 'N/A');

                if (diagnosis.diagnosisDescription) {
                    this.renderParagraph(doc, 'Diagnosis Description', diagnosis.diagnosisDescription);
                }

                this.renderField(doc, 'Diagnosis date',
                    diagnosis.diagnosisDate ? format(new Date(diagnosis.diagnosisDate), 'dd MMMM yyyy') : 'N/A');

                this.renderField(doc, 'Diagnosed by', diagnosis.diagnosedBy || 'N/A');
                this.renderField(doc, 'Primary diagnosis',
                    diagnosis.primaryDiagnosis === 'yes' ? 'Yes' : 'No');
            });
        }

        // Additional information
        if (content.referralSource) {
            doc.moveDown(0.5);
            this.renderField(doc, 'Referral Source',
                this.capitalizeFirst(content.referralSource));
        }

        if (content.serviceLocation && content.serviceLocation.length > 0) {
            this.renderField(doc, 'Service Location',
                content.serviceLocation.map(loc => this.capitalizeFirst(loc)).join(', '));
        }

        if (content.intakeDate) {
            this.renderField(doc, 'Intake Date',
                format(new Date(content.intakeDate), 'dd MMMM yyyy'));
        }

        if (content.otherClientInformation) {
            doc.moveDown(0.5);
            this.renderParagraph(doc, 'Other Client Information',
                content.otherClientInformation);
        }
    }

    renderAssessments(doc, content) {
        if (!content.items || content.items.length === 0) {
            return;
        }

        // Start assessments on a new page
        doc.addPage();
        this.renderSectionHeader(doc, 'Assessments');

        content.items.forEach((assessment, index) => {
            if (index > 0) {
                doc.moveDown(1.5);
                // Check if we need a new page
                if (doc.y > this.pageHeight - this.margin.bottom - 200) {
                    doc.addPage();
                }
            }

            // Assessment type
            const assessmentType = this.getAssessmentTypeName(assessment.type, assessment.customType);
            this.renderField(doc, 'Assessment Type', assessmentType);

            // Date
            if (assessment.date) {
                this.renderField(doc, 'Date',
                    format(new Date(assessment.date), 'dd MMMM yyyy'));
            }

            // Administered by
            if (assessment.administeredBy) {
                this.renderField(doc, 'Administered by', assessment.administeredBy);
            }

            // Methods used
            if (assessment.methodsUsed) {
                this.renderParagraph(doc, 'Methods Used', assessment.methodsUsed);
            }

            // Method notes
            if (assessment.methodNotes) {
                this.renderParagraph(doc, 'Method Notes', assessment.methodNotes);
            }

            // Strengths
            if (assessment.strengths) {
                this.renderParagraph(doc, 'Strengths', assessment.strengths);
            }

            // Deficits
            if (assessment.deficits) {
                this.renderParagraph(doc, 'Deficits', assessment.deficits);
            }

            // Summary findings
            if (assessment.summaryFindings) {
                this.renderParagraph(doc, 'Summary Findings', assessment.summaryFindings);
            }

            // Clinical interpretation
            if (assessment.clinicalInterpretation) {
                this.renderParagraph(doc, 'Clinical Interpretation',
                    assessment.clinicalInterpretation);
            }

            // Category
            if (assessment.category) {
                this.renderField(doc, 'Category',
                    this.formatCategory(assessment.category));
            }
        });
    }

    addPageNumbers(doc) {
        const pageCount = doc.bufferedPageRange().count;

        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);

            // Footer text
            const footerY = this.pageHeight - this.margin.bottom + 20;

            doc.fontSize(7)
                .fillColor(this.colors.text)
                .font('Helvetica')
                .text(
                    'This document was created using NooSphere ABA PMS. Visit www.noospherehub.net to get started',
                    this.margin.left,
                    footerY,
                    {
                        width: this.contentWidth - 50,
                        align: 'left'
                    }
                );

            // Page number
            doc.fontSize(10)
                .fillColor(this.colors.text)
                .text(
                    String(i + 1).padStart(2, '0'),
                    this.pageWidth - this.margin.right - 30,
                    footerY,
                    {
                        width: 30,
                        align: 'right'
                    }
                );
        }
    }

    // Helper methods
    getClientFullName(report) {
        const client = report.client?.client;
        if (!client) return 'N/A';

        const firstName = client.firstName || '';
        const lastName = client.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
    }

    calculateAge(dateOfBirth) {
        try {
            const dob = new Date(dateOfBirth);
            const now = new Date();
            let years = now.getFullYear() - dob.getFullYear();
            let months = now.getMonth() - dob.getMonth();

            if (months < 0) {
                years--;
                months += 12;
            }

            return `${years} years, ${months} months`;
        } catch {
            return 'N/A';
        }
    }

    getAssessmentTypeName(type, customType) {
        const typeMap = {
            'abas': 'ABAS (Adaptive Behavior Assessment System)',
            'vb-mapp': 'VB-MAPP',
            'ablls-r': 'ABLLS-R',
            'vineland': 'Vineland Adaptive Behavior Scales',
            'pdd': 'PDD Behavior Inventory',
            'custom': customType || 'Custom Assessment'
        };
        return typeMap[type] || type.toUpperCase();
    }

    formatCategory(category) {
        return category
            .split('-')
            .map(word => this.capitalizeFirst(word))
            .join(' ');
    }

    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    stripHtml(html) {
        if (!html) return '';

        // Remove HTML tags
        let text = html.replace(/<[^>]*>/g, '');

        // Decode common HTML entities
        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        return text.trim();
    }
}

export default ClinicalReportPdfGenerator;