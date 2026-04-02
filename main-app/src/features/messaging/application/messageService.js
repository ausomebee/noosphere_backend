class MessageService {
    constructor({ messageRepository }) {
        this.messageRepository = messageRepository;
    }

    async createMessage(data) {
        const newMessage = await this.messageRepository.create(data);

        if (!newMessage) {
            throw new Error("Failed to create message.");
        }

        return newMessage;
    }

    async updateMessage(data) {
        const record = await this.messageRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Message not found.");
        }

        const updated = await this.messageRepository.update(data.id, {
            content: data.content || record.content,
            isRead: data.isRead ?? record.isRead
        });

        if (!updated) {
            throw new Error("Failed to update message.");
        }

        return updated;
    }

    async getSingleMessage(id) {
        const record = await this.messageRepository.findOne({ id });

        if (!record) {
            throw new Error("Message not found.");
        }

        return record;
    }

    async getMessagesByUser(userId, userType) {
        const messages = await this.messageRepository.findAllAndPopulate(
            {
                OR: [
                    {
                        senderId: userId,
                        senderType: userType,
                    },
                    {
                        receiverId: userId,
                        receiverType: userType,
                    },
                ],
            },
            {}
        );

        const chats = {};

        messages.forEach((msg) => {
            const participants = [msg.senderId, msg.receiverId].sort().join("_");

            if (!chats[participants]) {
                chats[participants] = [];
            }

            chats[participants].push(msg);
        });

        const groupedChats = Object.values(chats);

        if (!groupedChats) {
            throw new Error("No messages found for this user.");
        }

        return groupedChats;
    }

    async markAsRead(messageId) {
        const record = await this.messageRepository.findOne({ id: messageId });

        if (!record) {
            throw new Error("Message not found.");
        }

        return await this.messageRepository.update(messageId, { isRead: true });
    }
}

export default MessageService;