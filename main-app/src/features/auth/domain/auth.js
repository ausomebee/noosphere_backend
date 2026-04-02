class Auth {
    constructor({ id, userId, secret, authQuestion, module }) {
        this.id = id;
        this.userId = userId;
        this.secret = secret;
        this.authQuestion = authQuestion;
        this.module = module;
    }
    
    get secretPayload() {
        return {
            userId: this.userId,
            secret: this.secret,
            module: this.module,
            authQuestion: this.authQuestion
        };
    }

}

export default Auth;