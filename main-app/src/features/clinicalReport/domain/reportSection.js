class ClinicalReportSection {
    constructor({ id, section, content, clinicalReportId, order }) {
        this.id = id;
        this.section = section;
        this.content = content;
        this.clinicalReportId = clinicalReportId;
        this.order = order;
    }

    get createSection() {
        return {
            section: this.section,
            content: this.content,
            clinicalReportId: this.clinicalReportId,
            order: this.order
        };
    }
}

export default ClinicalReportSection;