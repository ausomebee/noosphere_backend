import mime from "mime-types";

// The frontend supplies `documentDetails.type` itself, and it isn't always
// trustworthy (e.g. a .docx uploaded through an image-picker component can
// arrive tagged as "image/jpeg"). Re-derive the MIME type from the actual
// `fileUrl` extension whenever possible so a mislabeled type can never make
// it into the DB and break document rendering downstream.
function resolveDocumentType(documentDetails) {
    if (!documentDetails || typeof documentDetails !== "object" || !documentDetails.fileUrl) {
        return documentDetails;
    }

    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(documentDetails.fileUrl);
    } catch {
        decodedUrl = documentDetails.fileUrl;
    }

    // Strip a query/fragment and any stray trailing punctuation picked up
    // from a badly-encoded URL (e.g. a trailing %22 -> `"`).
    const path = decodedUrl.split(/[?#]/)[0].replace(/["')\]]+$/, "");
    const detectedType = mime.lookup(path);

    if (!detectedType || detectedType === documentDetails.type) {
        return documentDetails;
    }

    return { ...documentDetails, type: detectedType };
}

class ClientDocumentsService {
    constructor({ clientDocumentsRepository }) {
        this.clientDocumentsRepository = clientDocumentsRepository;
    }

    async createClientDocument(data) {
        const existing = await this.clientDocumentsRepository.findFirstDynamic({
            where: { name: data.name, tenantClientId: data.tenantClientId },
            select: { id: true }
        });

        if (existing) {
            throw new Error("This document already exists for this client.");
        }

        const newDoc = await this.clientDocumentsRepository.create({
            ...data,
            documentDetails: resolveDocumentType(data.documentDetails),
        });

        if (!newDoc) {
            throw new Error("Failed to create Client Document");
        }

        return newDoc;
    }

    async updateClientDocument(data) {
        const document = await this.clientDocumentsRepository.findOne({ id: data.id });

        if (!document) {
            throw new Error("Client Document not found");
        }

        const update = await this.clientDocumentsRepository.update(data.id, {
            name: data.name || document.name,
            documentDetails: data.documentDetails ? resolveDocumentType(data.documentDetails) : document.documentDetails,
            isDeleted: data.isDeleted ?? document.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update Client Document");
        }

        return update;
    }

    async getSingleClientDocument(data) {
        const document = await this.clientDocumentsRepository.findFirst({ id: data.id, isDeleted: false });

        if (!document) {
            throw new Error("Client Document not found");
        }

        return document;
    }

    async getClientDocuments(tenantClientId) {
        const documents = await this.clientDocumentsRepository.findAllAndPopulate({ tenantClientId, requestId: null, isDeleted: false }, {
            tenantStaff: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }
        });

        if (!documents) {
            throw new Error("Client Documents not found");
        }

        return documents;
    }

    async getDocumentsByRequestId(requestId) {
        const documents = await this.clientDocumentsRepository.findAll({ requestId, isDeleted: false });

        if (!documents) {
            throw new Error("Client Documents not found");
        }

        return documents;
    }
}

export default ClientDocumentsService;
