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

    generateStrongPassword(length = 12) {
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const special = "#?!@$%^&*-";
    
        const all = lower + upper + numbers + special;
        const getRandom = (str) => str.charAt(Math.floor(Math.random() * str.length));
    
        const password = [
            getRandom(lower),
            getRandom(upper),
            getRandom(numbers),
            getRandom(special),
            ...Array.from({ length: length - 4 }, () => getRandom(all))
        ];
    
        return password.sort(() => 0.5 - Math.random()).join('');
    }
    
}

export default ReferralCodeGenerator;