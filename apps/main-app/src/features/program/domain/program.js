class Program {
    constructor({name, id, description, domainId}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.domainId = domainId;
    }

    get createProgram() {
        return {
            name: this.name,
            description: this.description,
            domainId: this.domainId,
        };
    }
}

export default Program;