class RefreshToken {
    constructor({
        id,
        ownerId,
        ownerType,
        tokenHash,
        fingerprint,
        expiresAt,
        createdAt,
        used = false,
    }) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerType = ownerType;
        this.tokenHash = tokenHash;
        this.fingerprint = fingerprint;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.used = used;
    }

    get payload() {
        return {
            ownerId: this.ownerId,
            ownerType: this.ownerType,
            tokenHash: this.tokenHash,
            fingerprint: this.fingerprint,
            expiresAt: this.expiresAt,
            used: this.used,
        };
    }
}

export default RefreshToken;
