class Feature {
    constructor({ id, name, description, featureGroupId, active, applicablePlans }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.featureGroupId = featureGroupId;
        this.active = active;
        this.applicablePlans = applicablePlans;
    }

    get createFeature() {
        return {
            name: this.name,
            description: this.description,
            featureGroupId: this.featureGroupId,
            applicablePlans: this.applicablePlans
        };
    }

    get createFeatureGroup() {
        return {
            name: this.name
        };
    }

}

export default Feature;