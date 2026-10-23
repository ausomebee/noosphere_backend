import argon2 from "argon2";

class FeatureService {
    constructor({ featureRepository, featureGroupRepository, adminRepository }) {
        this.featureRepository = featureRepository;
        this.featureGroupRepository = featureGroupRepository;
        this.adminRepository = adminRepository;
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
            applicablePlans: data.applicablePlans || feature.applicablePlans,
            active: data.active ?? feature.active,
            managedBy: data.managedBy || feature.managedBy
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
        const feature = await this.featureRepository.findAllWithPlan();

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
        const featureGroup = await this.featureGroupRepository.findAllAndPopulate({}, { Feature: true });

        if (!featureGroup) {
            throw new Error("Feature group not found")
        }

        return featureGroup;
    }

    async deleteSingleFeatureGroup(data) {
        const superAdmin = await this.adminRepository.findFirst({
            where: { superAdmin: true, isDeleted: false }
        })

        if (!superAdmin) {
            throw new Error("Super admin not found")
        }

        if (!superAdmin.administratorPassword) {
            throw new Error("Super admin administrator password is not configured")
        }

        if (!(await argon2.verify(superAdmin.administratorPassword, data.administratorPassword))) {
            throw new Error('Incorrect password')
        }

        const featureGroup = await this.featureGroupRepository.findOne({ id: data.id });

        if (!featureGroup) {
            throw new Error("Feature group not found")
        }

        if (featureGroup.name.toUpperCase() === "EXTRA FEATURES") {
            throw new Error("you can't delete the extras group")
        }

        const extras = await this.featureGroupRepository.findFirst({ name: "Extra Features" })

        if (!extras) {
            throw new Error("Extras group not found")
        }

        const move = await this.featureRepository.updateWithGroup(featureGroup.id, { featureGroupId: extras.id })

        if (!move) {
            throw new Error("Failed to move items to extras")
        }

        const deleted = await this.featureGroupRepository.delete(featureGroup.id)

        if (!deleted) {
            throw new Error("Failed to delete group.")
        }

        return deleted;
    }

    async deleteSingleFeature(data) {
        const superAdmin = await this.adminRepository.findFirst({
            where: { superAdmin: true, isDeleted: false }
        })

        if (!superAdmin) {
            throw new Error("Super admin not found")
        }

        if (!superAdmin.administratorPassword) {
            throw new Error("Super admin administrator password is not configured")
        }

        if (!(await argon2.verify(superAdmin.administratorPassword, data.administratorPassword))) {
            throw new Error('Incorrect password')
        }

        const feature = await this.featureRepository.findOne({ id: data.id });

        if (!feature) {
            throw new Error("Feature not found")
        }

        const activeUsage = await this.featureRepository.findActivePlanUsage(feature.id);

        if (activeUsage) {
            const planNames = activeUsage.plans.map((plan) => plan.name).join(", ");
            throw new Error(`This feature cannot be removed because it is used in one or more plans`);
        }

        const extras = await this.featureGroupRepository.findFirst({
            name: "EXTRA FEATURES"
        });

        if (!extras) {
            throw new Error("Extras group not found")
        }

        const movedFeature = await this.featureRepository.moveToExtraFeatures(
            feature.id,
            extras.id
        );

        if (!movedFeature) {
            throw new Error("Failed to move feature to extras group")
        }

        return movedFeature;
    }

}

export default FeatureService;
