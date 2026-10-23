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

        // Colors (NooSphere blue palette)
        this.colors = {
            confidential: '#999999',
            primary: '#1E3A8A',
            secondary: '#2563EB',
            label: '#1E3A8A',
            text: '#374151',
            lightGray: '#F3F4F6',
            border: '#E5E7EB'
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
        this.renderHeader(doc, report);
        this.renderDocumentTitle(doc, report.title || 'Behaviour Intervention Plan');

        [...sections]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .forEach((section) => {
                if (section.content != null) {
                    this.renderCompleteSection(doc, section.section, section.content);
                }
            });
    }

    renderCompleteSection(doc, title, content) {
        if (content == null || (typeof content === 'object' && !Object.keys(content).length)) {
            return;
        }

        this.renderSectionHeader(doc, title);

        if (Array.isArray(content)) {
            content.forEach((entry, index) => {
                if (index > 0) {
                    doc.moveDown(0.8);
                }
                this.renderValue(doc, entry, index + 1);
            });
            return;
        }

        this.renderValue(doc, content);
    }

    renderValue(doc, value, entryNumber = null) {
        if (Array.isArray(value)) {
            value.forEach((entry, index) => {
                if (index > 0) {
                    doc.moveDown(0.5);
                }
                this.renderValue(doc, entry, index + 1);
            });
            return;
        }

        if (!value || typeof value !== 'object') {
            this.renderParagraph(doc, entryNumber ? `Assessment ${entryNumber}` : 'Value', value);
            return;
        }

        if (entryNumber) {
            this.renderEntryHeader(doc, `Assessment ${entryNumber}`);
        }

        Object.entries(value).forEach(([key, fieldValue]) => {
            if (fieldValue == null || fieldValue === '') {
                return;
            }

            const label = this.formatLabel(key);
            if (Array.isArray(fieldValue)) {
                this.renderEntryHeader(doc, label);
                fieldValue.forEach((entry, index) => {
                    this.renderValue(doc, entry, index + 1);
                });
            } else if (fieldValue && typeof fieldValue === 'object') {
                this.renderEntryHeader(doc, label);
                this.renderValue(doc, fieldValue);
            } else if (this.isImageValue(fieldValue)) {
                this.renderImageField(doc, label, fieldValue);
            } else if (this.isRichText(fieldValue) || String(fieldValue).length > 110) {
                this.renderParagraph(doc, label, fieldValue);
            } else {
                this.renderAlignedField(doc, label, this.formatDisplayValue(fieldValue));
            }
        });
    }

    renderEntryHeader(doc, title) {
        this.ensureSpace(doc, 28);
        doc.moveDown(0.25);
        doc.roundedRect(this.margin.left, doc.y, this.contentWidth, 20, 3)
            .fillColor('#EFF6FF')
            .fill();
        doc.rect(this.margin.left, doc.y, 3, 20)
            .fillColor(this.colors.secondary)
            .fill();
        doc.fillColor(this.colors.secondary)
            .font('Helvetica-Bold')
            .fontSize(9)
            .text(title.toUpperCase(), this.margin.left + 8, doc.y + 6, {
                width: this.contentWidth - 16
            });
        doc.y += 26;
    }

    renderAlignedField(doc, label, value) {
        const rowHeight = 18;
        this.ensureSpace(doc, rowHeight);

        const y = doc.y;
        const labelWidth = 155;
        doc.roundedRect(this.margin.left, y - 2, this.contentWidth, rowHeight, 2)
            .fillColor('#F8FAFC')
            .fill();
        doc.fillColor(this.colors.label)
            .font('Helvetica-Bold')
            .fontSize(8)
            .text(`${label}:`, this.margin.left + 7, y + 3, { width: labelWidth - 7 });
        doc.fillColor(this.colors.text)
            .font('Helvetica')
            .fontSize(9)
            .text(value || 'N/A', this.margin.left + labelWidth, y + 2, {
                width: this.contentWidth - labelWidth - 7,
                lineBreak: false
            });
        doc.y = y + rowHeight + 2;
    }

    ensureSpace(doc, height) {
        const bottom = this.pageHeight - this.margin.bottom - 12;
        if (doc.y + height > bottom) {
            doc.addPage();
        }
    }

    isRichText(value) {
        return typeof value === 'string' && /<\/?[a-z][^>]*>/i.test(value);
    }

    isImageValue(value) {
        return typeof value === 'string' && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value);
    }

    renderImageField(doc, label, imageData) {
        const imageBuffer = Buffer.from(imageData.split(',')[1] || '', 'base64');
        const maxWidth = Math.min(240, this.contentWidth - 24);
        const maxHeight = 100;

        this.ensureSpace(doc, maxHeight + 38);
        doc.fillColor(this.colors.label)
            .font(this.fonts.label.font)
            .fontSize(this.fonts.label.size)
            .text(`${label}:`);
        doc.moveDown(0.25);

        try {
            doc.image(imageBuffer, this.margin.left, doc.y, {
                fit: [maxWidth, maxHeight],
                align: 'left',
                valign: 'top'
            });
            doc.y += maxHeight + 8;
        } catch {
            this.renderAlignedField(doc, label, 'Image could not be rendered');
        }
    }

    formatLabel(key) {
        return key
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/^./, (letter) => letter.toUpperCase());
    }

    formatDisplayValue(value) {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (Array.isArray(value)) return value.map((entry) => this.formatDisplayValue(entry)).join(', ');
        return this.formatCategory(String(value));
    }

    renderHeader(doc, report) {
        const y = this.margin.top - 34;
        const tenant = report.tenant || {};
        const clientName = this.getClientFullName(report);
        const companyName = tenant.companyName || 'NooSphere Clinical Services';
        const location = tenant.location || {};
        const address = [location.address, location.city, location.stateProvince, location.country]
            .filter(Boolean)
            .join(', ');
        const rightX = this.margin.left + this.contentWidth * 0.57;
        const rightWidth = this.contentWidth * 0.43 - 18;
        const headerHeight = 92;

        doc.roundedRect(this.margin.left, y, this.contentWidth, headerHeight, 7)
            .fillColor('#1E3A8A')
            .fill();
        doc.rect(this.margin.left, y + headerHeight - 5, this.contentWidth, 5)
            .fillColor('#3B82F6')
            .fill();

        doc.roundedRect(this.margin.left + 18, y + 18, 48, 48, 10)
            .fillColor('#3B82F6')
            .fill();
        doc.fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .fontSize(16)
            .text(this.getInitials(companyName), this.margin.left + 18, y + 34, {
                width: 48,
                align: 'center'
            });

        doc.fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .fontSize(16)
            .text(companyName, this.margin.left + 84, y + 20, {
                width: rightX - this.margin.left - 98,
                lineBreak: false
            });
        doc.fillColor('#BFDBFE')
            .font('Helvetica')
            .fontSize(8)
            .text('BEHAVIOUR HEALTH AND CLINICAL SERVICES', this.margin.left + 84, y + 45, {
                characterSpacing: 1.2,
                width: rightX - this.margin.left - 98
            });
        doc.fillColor('#DBEAFE')
            .font('Helvetica')
            .fontSize(7)
            .text('CONFIDENTIAL CLINICAL DOCUMENT', this.margin.left + 84, y + 65, {
                characterSpacing: 0.8,
                width: 220
            });

        doc.fillColor('#BFDBFE')
            .font('Helvetica-Bold')
            .fontSize(8)
            .text('CONTACT', rightX, y + 18, { width: rightWidth });
        doc.fillColor('#FFFFFF')
            .font('Helvetica')
            .fontSize(8)
            .text(tenant.email || 'Email unavailable', rightX, y + 29, { width: rightWidth });
        if (tenant.phoneNumber) {
            doc.text(`+${tenant.phoneNumber}`, rightX, y + 41, { width: rightWidth });
        }
        if (address) {
            doc.fillColor('#DBEAFE').fontSize(7.5).text(address, rightX, y + 58, { width: rightWidth, height: 20 });
        }

        const metaY = y + headerHeight + 14;
        doc.roundedRect(this.margin.left, metaY, this.contentWidth, 38, 4)
            .fillColor('#EFF6FF')
            .fill();
        doc.fillColor('#1D4ED8')
            .font('Helvetica-Bold')
            .fontSize(7)
            .text('PREPARED FOR', this.margin.left + 12, metaY + 8);
        doc.fillColor('#1E3A8A')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text(clientName, this.margin.left + 12, metaY + 19, { width: 175, lineBreak: false });
        doc.fillColor('#1D4ED8')
            .font('Helvetica-Bold')
            .fontSize(7)
            .text('REPORT STATUS', this.margin.left + 210, metaY + 8);
        doc.fillColor('#1E3A8A')
            .font('Helvetica')
            .fontSize(9)
            .text(this.formatCategory(report.status || 'Clinical Report'), this.margin.left + 210, metaY + 19, { width: 110, lineBreak: false });
        doc.fillColor('#1D4ED8')
            .font('Helvetica-Bold')
            .fontSize(7)
            .text('DATE', this.margin.left + 350, metaY + 8);
        doc.fillColor('#1E3A8A')
            .font('Helvetica')
            .fontSize(9)
            .text(format(new Date(report.createdAt || Date.now()), 'dd MMM yyyy'), this.margin.left + 350, metaY + 19, { width: 90, lineBreak: false });

        doc.moveTo(this.margin.left, metaY + 52)
            .lineTo(this.margin.left + this.contentWidth, metaY + 52)
            .lineWidth(1)
            .strokeColor('#BFDBFE')
            .stroke();

        doc.y = metaY + 62;
    }

    getInitials(name) {
        return name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('') || 'NC';
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
        this.ensureSpace(doc, 38);
        doc.moveDown(0.8);
        doc.roundedRect(this.margin.left, doc.y, this.contentWidth, 28, 4)
            .fillColor(this.colors.primary)
            .fill();
        doc.fontSize(12)
            .fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .text(title.toUpperCase(), this.margin.left + 10, doc.y + 8, {
                width: this.contentWidth - 20,
                lineBreak: false
            });
        doc.y += 36;
    }

    renderField(doc, label, value, options = {}) {
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
        this.ensureSpace(doc, 42);

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
        const assessments = Array.isArray(content) ? content : (content.items || []);
        if (assessments.length === 0) {
            return;
        }

        this.renderSectionHeader(doc, 'Assessments');

        assessments.forEach((assessment, index) => {
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
                    this.isValidDate(assessment.date) ? format(new Date(assessment.date), 'dd MMMM yyyy') : assessment.date);
            }

            // Administered by
            if (assessment.administeredBy) {
                this.renderField(doc, 'Administered by', assessment.administeredBy);
            }

            // Methods used
            if (assessment.methodsUsed) {
                this.renderField(doc, 'Methods Used', this.formatList(assessment.methodsUsed));
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

    renderTargetBehaviours(doc, content) {
        const items = Array.isArray(content) ? content : [];
        if (items.length === 0) return;

        this.renderSectionHeader(doc, 'Target Behaviours');

        items.forEach((behaviour, index) => {
            if (index > 0) {
                doc.moveDown(1.5);
                if (doc.y > this.pageHeight - this.margin.bottom - 200) {
                    doc.addPage();
                }
            }

            this.renderField(doc, 'Name', behaviour.name || 'N/A');
            this.renderField(doc, 'Category', this.formatCategory(behaviour.category));
            if (behaviour.categoryOther) {
                this.renderField(doc, 'Category (Other)', behaviour.categoryOther);
            }

            if (behaviour.operationalDefinition) {
                this.renderParagraph(doc, 'Operational Definition', behaviour.operationalDefinition);
            }

            this.renderField(doc, 'Direction', this.formatCategory(behaviour.direction));
            this.renderField(doc, 'Function of Behavior', this.formatCategory(behaviour.functionOfBehavior));
            if (behaviour.functionOther) {
                this.renderField(doc, 'Function (Other)', behaviour.functionOther);
            }

            if (behaviour.antecedentConsequence) {
                this.renderParagraph(doc, 'Antecedent / Consequence', behaviour.antecedentConsequence);
            }

            if (behaviour.baselineDescription) {
                this.renderParagraph(doc, 'Baseline Description', behaviour.baselineDescription);
            }

            this.renderField(doc, 'Measurement Method', this.formatCategory(behaviour.measurementMethod));
            if (behaviour.measurementMethodOther) {
                this.renderField(doc, 'Measurement Method (Other)', behaviour.measurementMethodOther);
            }

            if (behaviour.graphReference) {
                this.renderField(doc, 'Graph Reference', behaviour.graphReference);
            }

            if (behaviour.settingsContext) {
                this.renderField(doc, 'Settings / Context', this.formatCategory(behaviour.settingsContext));
            }
            if (behaviour.settingsContextOther) {
                this.renderField(doc, 'Settings / Context (Other)', behaviour.settingsContextOther);
            }

            this.renderField(doc, 'Priority', this.formatCategory(behaviour.priority));
        });
    }

    renderBehaviourStrategies(doc, content) {
        const items = Array.isArray(content) ? content : [];
        if (items.length === 0) return;

        this.renderSectionHeader(doc, 'Behaviour Strategies');

        items.forEach((strategy, index) => {
            if (index > 0) {
                doc.moveDown(1.5);
                if (doc.y > this.pageHeight - this.margin.bottom - 200) {
                    doc.addPage();
                }
            }

            this.renderField(doc, 'Strategy Type', this.formatCategory(strategy.strategyType || strategy.strategyName));
            if (strategy.customStrategyType) {
                this.renderField(doc, 'Custom Strategy Type', strategy.customStrategyType);
            }

            this.renderField(doc, 'Target Behaviors', this.formatList(strategy.targetBehaviors));
            this.renderField(doc, 'Function Addressed', this.formatCategory(strategy.functionAddressed));

            if (strategy.replacementBehavior) {
                this.renderField(doc, 'Replacement Behavior', strategy.replacementBehavior);
            }
            if (strategy.strategyDescription) {
                this.renderParagraph(doc, 'Strategy Description', strategy.strategyDescription);
            }
            if (strategy.whenToUse) {
                this.renderParagraph(doc, 'When to Use', strategy.whenToUse);
            }

            this.renderField(doc, 'Responsible Staff', this.formatList(strategy.responsibleStaff));
            this.renderField(doc, 'Fidelity Requirements', this.formatCategory(strategy.fidelityRequirements));
            if (strategy.customFidelityRequirement) {
                this.renderField(doc, 'Custom Fidelity Requirement', strategy.customFidelityRequirement);
            }

            this.renderField(doc, 'Data Collected', this.formatList(strategy.dataCollected));
            if (strategy.customDataCollected) {
                this.renderField(doc, 'Custom Data Collected', this.formatList(strategy.customDataCollected));
            }
        });
    }

    renderCrisisSafety(doc, content) {
        const items = Array.isArray(content) ? content : [];
        if (items.length === 0) return;

        this.renderSectionHeader(doc, 'Crisis & Safety');

        items.forEach((crisis, index) => {
            if (index > 0) {
                doc.moveDown(1.5);
                if (doc.y > this.pageHeight - this.margin.bottom - 200) {
                    doc.addPage();
                }
            }

            this.renderField(doc, 'Crisis Type', this.formatCategory(crisis.crisisType));
            if (crisis.crisisTypeOther) {
                this.renderField(doc, 'Crisis Type (Other)', crisis.crisisTypeOther);
            }
            if (crisis.descriptionOfCrisisBehavior) {
                this.renderParagraph(doc, 'Description of Crisis Behavior', crisis.descriptionOfCrisisBehavior);
            }
            if (crisis.earlyWarningSigns) {
                this.renderField(doc, 'Early Warning Signs', crisis.earlyWarningSigns);
            }
            if (crisis.knownTriggers) {
                this.renderField(doc, 'Known Triggers', crisis.knownTriggers);
            }

            this.renderField(doc, 'Risk Level', this.formatCategory(crisis.riskLevel));
            if (crisis.crisisActivationCriteria) {
                this.renderField(doc, 'Crisis Activation Criteria', this.formatCategory(crisis.crisisActivationCriteria));
            }
            if (crisis.immediateResponseProcedures) {
                this.renderParagraph(doc, 'Immediate Response Procedures', crisis.immediateResponseProcedures);
            }

            this.renderField(doc, 'De-escalation Techniques', this.formatList(crisis.deescalationTechniques));
            if (crisis.deescalationTechniquesOther) {
                this.renderField(doc, 'De-escalation Techniques (Other)', crisis.deescalationTechniquesOther);
            }

            this.renderField(doc, 'Physical Intervention Permitted', this.formatCategory(crisis.physicalInterventionPermitted));
            if (crisis.staffAuthorizedToIntervene) {
                this.renderField(doc, 'Staff Authorized to Intervene', this.formatCategory(crisis.staffAuthorizedToIntervene));
            }
            if (crisis.staffAuthorizedOther) {
                this.renderField(doc, 'Staff Authorized (Other)', crisis.staffAuthorizedOther);
            }
            if (crisis.environmentalSafetyActions) {
                this.renderField(doc, 'Environmental Safety Actions', crisis.environmentalSafetyActions);
            }

            this.renderField(doc, 'Emergency Services Involvement', this.formatCategory(crisis.emergencyServicesInvolvement));
            if (crisis.emergencyContactInstructions) {
                this.renderParagraph(doc, 'Emergency Contact Instructions', crisis.emergencyContactInstructions);
            }
            if (crisis.postCrisisProcedure) {
                this.renderField(doc, 'Post Crisis Procedure', crisis.postCrisisProcedure);
            }

            this.renderField(doc, 'Incident Documentation Required', crisis.incidentDocumentationRequired === 'yes' ? 'Yes' : 'No');
            this.renderField(doc, 'Review Schedule', this.formatCategory(crisis.reviewSchedule));

            if (crisis.additionalNotes) {
                this.renderParagraph(doc, 'Additional Notes', crisis.additionalNotes);
            }
        });
    }

    renderGoalsTargets(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Goals & Targets');

        if (content.goalStatement) {
            this.renderParagraph(doc, 'Goal Statement', content.goalStatement);
        }
        if (content.goalDomain) {
            this.renderField(doc, 'Goal Domain', this.formatCategory(content.goalDomain));
        }
        if (content.goalDomainOther) {
            this.renderField(doc, 'Goal Domain (Other)', content.goalDomainOther);
        }
        if (content.baselineLevel) {
            this.renderField(doc, 'Baseline Level', content.baselineLevel);
        }
        if (content.goalTimeframe) {
            this.renderField(doc, 'Goal Timeframe', this.formatCategory(content.goalTimeframe));
        }
        if (content.measurementMethod) {
            this.renderField(doc, 'Measurement Method', this.formatCategory(content.measurementMethod));
        }
        if (content.measurementMethodOther) {
            this.renderField(doc, 'Measurement Method (Other)', content.measurementMethodOther);
        }

        if (content.targetStatement) {
            doc.moveDown(0.5);
            this.renderParagraph(doc, 'Target Statement', content.targetStatement);
        }
        if (content.targetType) {
            this.renderField(doc, 'Target Type', this.formatCategory(content.targetType));
        }
        if (content.baselineLevelReference) {
            this.renderField(doc, 'Baseline Level Reference', content.baselineLevelReference);
        }
        if (content.masteryCriteria) {
            this.renderField(doc, 'Mastery Criteria', content.masteryCriteria);
        }
        if (content.reviewTimeframe) {
            this.renderField(doc, 'Review Timeframe', this.formatCategory(content.reviewTimeframe));
        }
        if (content.targetStatus) {
            this.renderField(doc, 'Target Status', this.formatCategory(content.targetStatus));
        }
        if (content.discontinuationCriteria) {
            this.renderField(doc, 'Discontinuation Criteria', content.discontinuationCriteria);
        }
    }

    renderMonitoringData(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Monitoring Data');

        if (content.dataCollectionOverview) {
            this.renderParagraph(doc, 'Data Collection Overview', content.dataCollectionOverview);
        }
        if (content.behaviorsTargetsMonitored) {
            this.renderField(doc, 'Behaviors / Targets Monitored', content.behaviorsTargetsMonitored);
        }
        if (content.measurementMethods) {
            this.renderField(doc, 'Measurement Methods', this.formatCategory(content.measurementMethods));
        }
        if (content.measurementMethodsOther) {
            this.renderField(doc, 'Measurement Methods (Other)', content.measurementMethodsOther);
        }
        if (content.dataCollectionFrequency) {
            this.renderField(doc, 'Data Collection Frequency', this.formatCategory(content.dataCollectionFrequency));
        }
        if (content.whoCollectsData) {
            this.renderField(doc, 'Who Collects Data', content.whoCollectsData);
        }
        if (content.dataRecordingTools) {
            this.renderField(doc, 'Data Recording Tools', this.formatCategory(content.dataRecordingTools));
        }
        if (content.dataRecordingToolsOther) {
            this.renderField(doc, 'Data Recording Tools (Other)', content.dataRecordingToolsOther);
        }
        if (content.dataReviewFrequency) {
            this.renderField(doc, 'Data Review Frequency', this.formatCategory(content.dataReviewFrequency));
        }
        if (content.dataStorageLocation) {
            this.renderField(doc, 'Data Storage Location', this.formatCategory(content.dataStorageLocation));
        }
        if (content.dataStorageLocationOther) {
            this.renderField(doc, 'Data Storage Location (Other)', content.dataStorageLocationOther);
        }
        if (content.progressReportingMethods) {
            this.renderField(doc, 'Progress Reporting Methods', this.formatCategory(content.progressReportingMethods));
        }
        if (content.supportingDataAttachments) {
            this.renderField(doc, 'Supporting Data Attachments', content.supportingDataAttachments);
        }
        if (content.supportingDataDescription) {
            this.renderParagraph(doc, 'Supporting Data Description', content.supportingDataDescription);
        }
        if (content.dataInterpretation) {
            this.renderParagraph(doc, 'Data Interpretation', content.dataInterpretation);
        }
        if (content.dataLimitationsNotes) {
            this.renderParagraph(doc, 'Data Limitations Notes', content.dataLimitationsNotes);
        }
    }

    renderImplementationNotes(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Implementation Notes');

        if (content.implementationOverview) {
            this.renderParagraph(doc, 'Implementation Overview', content.implementationOverview);
        }
        if (content.serviceSettings) {
            this.renderField(doc, 'Service Settings', this.formatCategory(content.serviceSettings));
        }
        if (content.sessionStructure) {
            this.renderField(doc, 'Session Structure', content.sessionStructure);
        }
        if (content.staffRolesResponsibilities) {
            this.renderField(doc, 'Staff Roles & Responsibilities', content.staffRolesResponsibilities);
        }
        if (content.caregiverInvolvement) {
            this.renderField(doc, 'Caregiver Involvement', this.formatCategory(content.caregiverInvolvement));
        }
        if (content.caregiverTrainingDetails) {
            this.renderField(doc, 'Caregiver Training Details', content.caregiverTrainingDetails);
        }
        if (content.materialsRequired) {
            this.renderField(doc, 'Materials Required', content.materialsRequired);
        }
        if (content.environmentalConsiderations) {
            this.renderField(doc, 'Environmental Considerations', content.environmentalConsiderations);
        }
        if (content.coordinationWithProviders) {
            this.renderField(doc, 'Coordination With Providers', this.formatCategory(content.coordinationWithProviders));
        }
        if (content.coordinationWithProvidersOther) {
            this.renderField(doc, 'Coordination With Providers (Other)', content.coordinationWithProvidersOther);
        }
        if (content.implementationConstraints) {
            this.renderField(doc, 'Implementation Constraints', content.implementationConstraints);
        }
        if (content.fidelityMonitoringInPlace) {
            this.renderField(doc, 'Fidelity Monitoring In Place', content.fidelityMonitoringInPlace === 'yes' ? 'Yes' : 'No');
        }
        if (content.fidelityMonitoringNotes) {
            this.renderParagraph(doc, 'Fidelity Monitoring Notes', content.fidelityMonitoringNotes);
        }
    }

    renderGeneralization(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Generalization');

        if (content.targetBehaviors) {
            this.renderField(doc, 'Target Behaviors', this.formatList(content.targetBehaviors));
        }
        if (content.generalizationApproach) {
            this.renderField(doc, 'Generalization Approach', this.formatCategory(content.generalizationApproach));
        }
        if (content.generalizationApproachOther) {
            this.renderField(doc, 'Generalization Approach (Other)', content.generalizationApproachOther);
        }
        if (content.generalizationDescription) {
            this.renderParagraph(doc, 'Generalization Description', content.generalizationDescription);
        }
        if (content.settingsForGeneralization) {
            this.renderField(doc, 'Settings For Generalization', content.settingsForGeneralization);
        }
        if (content.settingsForGeneralizationOther) {
            this.renderField(doc, 'Settings For Generalization (Other)', content.settingsForGeneralizationOther);
        }
        if (content.peopleInvolvedInGeneralization) {
            this.renderField(doc, 'People Involved', this.formatCategory(content.peopleInvolvedInGeneralization));
        }
        if (content.peopleInvolvedOther) {
            this.renderField(doc, 'People Involved (Other)', content.peopleInvolvedOther);
        }
        if (content.materialsVariationPlan) {
            this.renderField(doc, 'Materials Variation Plan', content.materialsVariationPlan);
        }
        if (content.maintenancePlan) {
            this.renderField(doc, 'Maintenance Plan', content.maintenancePlan);
        }
        if (content.maintenanceSchedule) {
            this.renderField(doc, 'Maintenance Schedule', this.formatCategory(content.maintenanceSchedule));
        }
        if (content.fadingPlan) {
            this.renderField(doc, 'Fading Plan', content.fadingPlan);
        }
        if (content.criteriaForMaintenanceSuccess) {
            this.renderField(doc, 'Criteria For Maintenance Success', content.criteriaForMaintenanceSuccess);
        }
        if (content.generalizationMaintenanceNotes) {
            this.renderParagraph(doc, 'Generalization / Maintenance Notes', content.generalizationMaintenanceNotes);
        }
    }

    renderReview(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Review');

        if (content.reviewType) {
            this.renderField(doc, 'Review Type', this.formatCategory(content.reviewType));
        }
        if (content.reviewDate) {
            this.renderField(doc, 'Review Date',
                this.isValidDate(content.reviewDate) ? format(new Date(content.reviewDate), 'dd MMMM yyyy') : content.reviewDate);
        }
        if (content.reviewedBy) {
            this.renderField(doc, 'Reviewed By', content.reviewedBy);
        }
        if (content.summaryOfProgress) {
            this.renderParagraph(doc, 'Summary of Progress', content.summaryOfProgress);
        }
        if (content.progressDetermination) {
            this.renderField(doc, 'Progress Determination', this.formatCategory(content.progressDetermination));
        }
        if (content.decisionOutcome) {
            this.renderField(doc, 'Decision Outcome', this.formatCategory(content.decisionOutcome));
        }
        if (content.rationaleForDecision) {
            this.renderParagraph(doc, 'Rationale For Decision', content.rationaleForDecision);
        }
        if (content.changesRecommended) {
            this.renderParagraph(doc, 'Changes Recommended', content.changesRecommended);
        }
        if (content.nextReviewTimeline) {
            this.renderField(doc, 'Next Review Timeline', this.formatCategory(content.nextReviewTimeline));
        }

        const services = Array.isArray(content.items) ? content.items : [];
        services.forEach((service, index) => {
            doc.moveDown(1);
            if (doc.y > this.pageHeight - this.margin.bottom - 150) {
                doc.addPage();
            }

            this.renderField(doc, `Service Recommendation ${index + 1}`, service.serviceRecommendation || 'N/A');
            if (service.descriptionOfServices) {
                this.renderParagraph(doc, 'Description of Services', service.descriptionOfServices);
            }
            if (service.numberOfHoursRequested) {
                this.renderField(doc, 'Number of Hours Requested', service.numberOfHoursRequested);
            }
            if (service.durationOfService) {
                this.renderField(doc, 'Duration of Service', service.durationOfService);
            }
            if (service.location) {
                this.renderField(doc, 'Location', this.formatCategory(service.location));
            }
            if (service.locationOther) {
                this.renderField(doc, 'Location (Other)', service.locationOther);
            }
        });
    }

    renderDischarge(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Discharge');

        if (content.dischargeReason) {
            this.renderField(doc, 'Discharge Reason', content.dischargeReason);
        }
        if (content.dischargeDate) {
            this.renderField(doc, 'Discharge Date',
                this.isValidDate(content.dischargeDate) ? format(new Date(content.dischargeDate), 'dd MMMM yyyy') : content.dischargeDate);
        }
        if (content.progressCompared) {
            this.renderField(doc, 'Progress Compared', content.progressCompared);
        }
        if (content.dischargeCriteria) {
            this.renderField(doc, 'Discharge Criteria', content.dischargeCriteria);
        }
        if (content.dischargeSummary) {
            this.renderParagraph(doc, 'Discharge Summary', content.dischargeSummary);
        }
        if (content.postDischargeRecommendations) {
            this.renderField(doc, 'Post-Discharge Recommendations', content.postDischargeRecommendations);
        }
        if (content.transitionSupports) {
            this.renderField(doc, 'Transition Supports', content.transitionSupports);
        }
        if (content.supportingDocuments) {
            this.renderField(doc, 'Supporting Documents', content.supportingDocuments);
        }
        if (content.reviewNotes) {
            this.renderParagraph(doc, 'Review Notes', content.reviewNotes);
        }
    }

    renderConsentSignatures(doc, content) {
        if (!content || Object.keys(content).length === 0) return;

        this.renderSectionHeader(doc, 'Consent & Signatures');

        if (content.consentStatement) {
            this.renderParagraph(doc, 'Consent Statement', content.consentStatement);
        }
        if (content.servicesConsented) {
            this.renderField(doc, 'Services Consented', content.servicesConsented);
        }
        if (content.consentLimitations) {
            this.renderField(doc, 'Consent Limitations', content.consentLimitations);
        }
        if (content.clientGuardianName) {
            this.renderField(doc, 'Client / Guardian Name', content.clientGuardianName);
        }
        if (content.relationshipToClient) {
            this.renderField(doc, 'Relationship To Client', this.formatCategory(content.relationshipToClient));
        }

        doc.moveDown(0.5);
        this.renderSignature(doc, 'Client Signature', content.clientSignature);
        if (content.clientSignatureDate) {
            this.renderField(doc, 'Client Signature Date',
                this.isValidDate(content.clientSignatureDate) ? format(new Date(content.clientSignatureDate), 'dd MMMM yyyy') : content.clientSignatureDate);
        }

        doc.moveDown(0.5);
        if (content.clinicianName) {
            this.renderField(doc, 'Clinician Name', content.clinicianName);
        }
        if (content.clinicianRole) {
            this.renderField(doc, 'Clinician Role', this.formatCategory(content.clinicianRole));
        }
        this.renderSignature(doc, 'Clinician Signature', content.clinicianSignature);
        if (content.clinicianSignatureDate) {
            this.renderField(doc, 'Clinician Signature Date',
                this.isValidDate(content.clinicianSignatureDate) ? format(new Date(content.clinicianSignatureDate), 'dd MMMM yyyy') : content.clinicianSignatureDate);
        }

        if (content.consentNotes) {
            doc.moveDown(0.5);
            this.renderParagraph(doc, 'Consent Notes', content.consentNotes);
        }
    }

    renderSignature(doc, label, signature) {
        if (!signature || typeof signature !== 'string') {
            this.renderField(doc, label, 'N/A');
            return;
        }

        if (signature.startsWith('data:image')) {
            if (doc.y > this.pageHeight - this.margin.bottom - 120) {
                doc.addPage();
            }

            doc.fontSize(this.fonts.label.size)
                .fillColor(this.colors.label)
                .font(this.fonts.label.font)
                .text(label + ':');
            doc.moveDown(0.2);

            try {
                const base64Data = signature.split(',')[1] || '';
                const imageBuffer = Buffer.from(base64Data, 'base64');
                doc.image(imageBuffer, this.margin.left, doc.y, { width: 180 });
                doc.moveDown(4);
            } catch {
                this.renderField(doc, `${label} (image unreadable)`, 'N/A');
            }
            return;
        }

        this.renderField(doc, label, signature);
    }

    addPageNumbers(doc) {
        const pageCount = doc.bufferedPageRange().count;

        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);

            // Footer text
            const footerY = this.pageHeight - this.margin.bottom - 15;

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
        if (!category || typeof category !== 'string') return 'N/A';
        return category
            .split('-')
            .map(word => this.capitalizeFirst(word))
            .join(' ');
    }

    formatList(values) {
        if (!values) return 'N/A';
        const arr = Array.isArray(values) ? values : [values];
        if (arr.length === 0) return 'N/A';
        return arr.map(v => this.formatCategory(v)).join(', ');
    }

    isValidDate(value) {
        return !isNaN(new Date(value).getTime());
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