class ClinicalReportSection {
    constructor({ id, section, content, clinicalReportId }) {
        this.id = id;
        this.section = section;
        this.content = content;
        this.clinicalReportId = clinicalReportId;
    }

    get createSection() {
        return {
            section: this.section,
            content: this.content,
            clinicalReportId: this.clinicalReportId
        };
    }
}

export default ClinicalReportSection;