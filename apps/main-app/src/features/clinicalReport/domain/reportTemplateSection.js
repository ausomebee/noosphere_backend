class ClinicalReportTemplateSection {
    constructor({ id, section, content, templateId }) {
        this.id = id;
        this.section = section;
        this.content = content;
        this.templateId = templateId;
    }

    get createSection() {
        return {
            section: this.section,
            content: this.content,
            templateId: this.templateId
        };
    }
}

export default ClinicalReportTemplateSection;