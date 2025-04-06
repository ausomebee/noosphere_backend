class ReferralCodeGenerator {
    constructor(length = 8) {
        this.codeLength = length;
    }

    generate(input = "") {
        const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
        const base = input ? input.substring(0, 3).toUpperCase() : "";
        return (base + randomString).substring(0, this.codeLength);
    }

    validate(code) {
        const regex = new RegExp(`^[A-Z0-9]{${this.codeLength}}$`);
        return regex.test(code);
    }

    generateRandom(len) {
        return Array.from({ length: len }, () => {
            const chars = "0123456789";
            return chars.charAt(Math.floor(Math.random() * chars.length));
        }).join("");
    }
}

export default ReferralCodeGenerator;