class Notification {
    constructor({ id, userId, userType, type, title, content, isRead, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.userType = userType;
        this.type = type;
        this.title = title;
        this.content = content;
        this.isRead = isRead ?? false;
        this.createdAt = createdAt;
    }

    get createNotification() {
        return {
            userId: this.userId,
            userType: this.userType,
            type: this.type,
            title: this.title,
            content: this.content,
            isRead: this.isRead
        };
    }
}

export default Notification;