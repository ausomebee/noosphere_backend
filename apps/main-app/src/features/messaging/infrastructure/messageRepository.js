import BaseRepository from "./baseRepository.js";

class MessageRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAllAndPopulate(query, populate) {
        return await this.model.findMany({
            where: query,
            include: populate,
            orderBy: {
                createdAt: "asc"
            }
        });
    }

    findByClientMessageId(senderId, senderType, clientMessageId) {
        return this.model.findFirst({ where: { senderId, senderType, clientMessageId } });
    }
}

export default MessageRepository;
