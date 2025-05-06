class Auth {
    constructor({ id, userId, secret, authQuestion }) {
        this.id = id;
        this.userId = userId;
        this.secret = secret;
        this.authQuestion = authQuestion;
    }
    
    get secretPayload() {
        return {
            userId: this.userId,
            secret: this.secret,
            authQuestion: this.authQuestion
        };
    }

}

export default Auth;