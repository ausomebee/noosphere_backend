class Plan {
    constructor({ id, name, description, price, billingCycle }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.billingCycle = billingCycle;
    }
    
    get createBillingPlan() {
        return {
            name: this.name,
            description: this.description,
            price: this.price,
            billingCycle: this.billingCycle,
        };
    }

}

export default Plan;