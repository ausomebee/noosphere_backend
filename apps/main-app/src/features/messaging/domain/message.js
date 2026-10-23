class Message {
    constructor({ id, senderId, senderType, receiverId, receiverType, content, isRead, createdAt }) {
        this.id = id;
        this.senderId = senderId;
        this.senderType = senderType;
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.content = content;
        this.isRead = isRead ?? false;
        this.createdAt = createdAt;
    }

    get createMessage() {
        return {
            senderId: this.senderId,
            senderType: this.senderType,
            receiverId: this.receiverId,
            receiverType: this.receiverType,
            content: this.content,
            isRead: this.isRead
        };
    }
}

export default Message;