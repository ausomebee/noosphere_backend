class Auth {
    constructor({ id, userId, secret }) {
        this.id = id;
        this.userId = userId;
        this.secret = secret;
    }
    
    get secretPayload() {
        return {
            userId: this.userId,
            secret: this.secret
        };
    }

}

export default Auth;