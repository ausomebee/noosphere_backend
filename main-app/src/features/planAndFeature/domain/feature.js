class Feature {
    constructor({ id, name, description, featureGroupId, active, managedBy }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.featureGroupId = featureGroupId;
        this.active = active;
        this.managedBy = managedBy;
    }

    get createFeature() {
        return {
            name: this.name,
            description: this.description,
            featureGroupId: this.featureGroupId,
            managedBy: this.managedBy
        };
    }

    get createFeatureGroup() {
        return {
            name: this.name
        };
    }

}

export default Feature;