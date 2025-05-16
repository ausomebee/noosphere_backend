class FeatureService {
    constructor({ featureRepository, featureGroupRepository }) {
        this.featureRepository = featureRepository;
        this.featureGroupRepository = featureGroupRepository;
    }

    async createFeature(data) {
        const featureExists = await this.featureRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (featureExists) {
            throw new Error("This Feature already exists.");
        }

        const newFeature = await this.featureRepository.create(data);

        if (!newFeature) {
            throw new Error("Failed to create Feature");
        }

        return newFeature;
    }

    async updateFeature(data) {
        const feature = await this.featureRepository.findOne({ id: data.id })

        if (!feature) {
            throw new Error("Feature not found");
        }

        const update = await this.featureRepository.update(data.id, {
            name: data.name || feature.name,
            description: data.description || feature.description,
            price: data.price || feature.price,
            billingCycle: data.billingCycle || feature.billingCycle
        });

        if (!update) {
            throw new Error("Failed to update feature");
        }

        return update;
    }

    async getSingleFeature(data) {
        const feature = await this.featureRepository.findOne({ id: data.id });

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }

    async getAllFeature(data) {
        const feature = await this.featureRepository.findAll({});

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }

    async createFeatureGroup(data) {
        const featureGroupExists = await this.featureGroupRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (featureGroupExists) {
            throw new Error("This Feature group already exists.");
        }

        const newFeatureGroup = await this.featureGroupRepository.create(data);

        if (!newFeatureGroup) {
            throw new Error("Failed to create Feature group");
        }

        return newFeatureGroup;
    }

    async updateFeatureGroup(data) {
        const featureGroup = await this.featureGroupRepository.findOne({ id: data.id })

        if (!featureGroup) {
            throw new Error("Feature group not found");
        }

        const update = await this.featureGroupRepository.update(data.id, {
            name: data.name || featureGroup.name,
            active: data.active || featureGroup.active
        });

        if (!update) {
            throw new Error("Failed to update feature group");
        }

        return update;
    }

    async getSingleFeatureGroup(data) {
        const featureGroup = await this.featureGroupRepository.findOne({ id: data.id });

        if (!featureGroup) {
            throw new Error("Feature group not found")
        }

        return featureGroup;
    }

    async getAllFeatureGroup(data) {
        const featureGroup = await this.featureGroupRepository.findAll({});

        if (!featureGroup) {
            throw new Error("Feature group not found")
        }

        return featureGroup;
    }

}

export default FeatureService;