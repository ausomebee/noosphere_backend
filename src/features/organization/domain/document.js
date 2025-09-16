class Document {
    constructor({ id, tenantId, documentName, documentUrl, uploadedBy, createdAt, isDeleted }) {
        this.id = id;
        this.tenantId = tenantId;
        this.documentName = documentName;
        this.documentUrl = documentUrl;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
        this.isDeleted = isDeleted;
    }

    get createDocument() {
        return {
            tenantId: this.tenantId,
            documentName: this.documentName,
            documentUrl: this.documentUrl,
            uploadedBy: this.uploadedBy,
            createdAt: this.createdAt
        };
    }

}

export default Document;