class ClientFiles {
    constructor({
        id,
        name,
        url,
        size,
        uploadedBy,
        fileType,
        folderId,
        clientTenantId,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.size = size;
        this.uploadedBy = uploadedBy;
        this.fileType = fileType;
        this.folderId = folderId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.clientTenantId = clientTenantId;
    }

    get createClientFile() {
        return {
            name: this.name,
            url: this.url,
            size: this.size,
            uploadedBy: this.uploadedBy,
            fileType: this.fileType,
            folderId: this.folderId,
            clientTenantId: this.clientTenantId
        };
    }
}

export default ClientFiles;
