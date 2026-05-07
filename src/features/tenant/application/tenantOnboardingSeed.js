const MODIFIER_OPTIONS = new Set(["HO", "HP", "HN", "HM", "95", "GT", "KX", "59", "76", "77"]);

const ORGANIZATION_DIAGNOSIS_CODE_SEED = [
    { description: "Autistic Disorder", code: "F84.0", isActive: true },
    { description: "Asperger's Syndrome", code: "F84.5", isActive: true },
    { description: "Pervasive development disorder, unspecified", code: "F84.9", isActive: true },
    { description: "Receptive language disorder", code: "F80.2", isActive: true },
    { description: "Development disorder of speech and language, unspecified", code: "F80.9", isActive: true },
    { description: "Other disorders of psychological development", code: "F88", isActive: true },
    { description: "Unspecified disorder of psychological development", code: "F89", isActive: true },
    { description: "Attention deficit disorder (inattentive type)", code: "F80.2", isActive: true },
    { description: "Attention deficit disorder with hyperactivity", code: "F90.1", isActive: true },
    { description: "Attention deficit disorder combined type", code: "F90.2", isActive: true },
    { description: "Attention deficit disorder, unspecified", code: "F90.9", isActive: true },
];

const ROUNDING_RULE_SEED = {
    ruleType: "standard",
    ruleName: "8 Minute Rule",
    description: "Round up when time is more than 8 min into the next 15 min block",
    standardUnit: null,
    roundingRule: null,
    isDeleted: false,
    isActive: true,
};

const SESSION_TYPE_SEED = [
    {
        name: "Initial Assessment - BCBA",
        category: "Assessment",
        cptCodes: "97151",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Re-assessment - BCBA",
        category: "Assessment",
        cptCodes: "97151",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Treatment Planning",
        category: "Planning/Admin",
        cptCodes: "97151",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Supervision of Tech - BCBA",
        category: "Supervision",
        cptCodes: "97155",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Caregiver/Parent Training - BCBA",
        category: "Caregiver Training",
        cptCodes: "97156",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Direct ABA - Tech, Individual, Clinic",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: true,
    },
    {
        name: "Direct ABA - Tech, Individual, Home",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "UB",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Home"],
        isBillable: true,
    },
    {
        name: "Direct ABA - Tech, Group, Clinic",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "Group",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: true,
    },
    {
        name: "Direct ABA - Tech, Group, Home",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "UB + Group",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Home"],
        isBillable: true,
    },
    {
        name: "Telehealth Parent Training - BCBA",
        category: "Caregiver Training",
        cptCodes: "97156",
        defaultModifier: "95",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Telehealth"],
        isBillable: true,
    },
    {
        name: "Telehealth Supervision - BCBA",
        category: "Supervision",
        cptCodes: "97155",
        defaultModifier: "95",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Telehealth"],
        isBillable: true,
    },
    {
        name: "Telehealth Direct ABA - Tech",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "95",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Telehealth"],
        isBillable: true,
    },
    {
        name: "School Consultation - BCBA",
        category: "Consultation",
        cptCodes: "97155 / 97156",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["School"],
        isBillable: true,
    },
    {
        name: "IEP Meeting Attendance - BCBA",
        category: "Consultation/Admin",
        cptCodes: "97156 / Non-billable",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["School", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Treatment Review - BCBA",
        category: "Review/Monitoring",
        cptCodes: "97155",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Program Modification - BCBA",
        category: "Program Update",
        cptCodes: "97155",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Behavior Reduction Session - Tech",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home"],
        isBillable: true,
    },
    {
        name: "Skill Acquisition Session - Tech",
        category: "Direct Service",
        cptCodes: "97153",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home"],
        isBillable: true,
    },
    {
        name: "Social Skills Group - Tech",
        category: "Direct Service",
        cptCodes: "97154",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: true,
    },
    {
        name: "Family Guidance - BCBA",
        category: "Caregiver Training",
        cptCodes: "97156",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "Telehealth"],
        isBillable: true,
    },
    {
        name: "Crisis Intervention - BCBA",
        category: "Crisis",
        cptCodes: "97155",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School"],
        isBillable: true,
    },
    {
        name: "Crisis Intervention - Tech",
        category: "Crisis",
        cptCodes: "97153",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School"],
        isBillable: true,
    },
    {
        name: "Observation Only - BCBA",
        category: "Observation",
        cptCodes: "97151 / 97155",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Home", "School"],
        isBillable: true,
    },
    {
        name: "Team Meeting - BCBA",
        category: "Admin/Collaboration",
        cptCodes: "97156 / Non-billable",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "School", "Telehealth"],
        isBillable: false,
    },
    {
        name: "Non-Billable Admin",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Telehealth"],
        isBillable: false,
    },
    {
        name: "Indirect Time - Program Development",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: false,
    },
    {
        name: "Indirect Time - Report Writing",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: false,
    },
    {
        name: "Indirect Time - Parent Communication",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic", "Telehealth"],
        isBillable: false,
    },
    {
        name: "Indirect Time - Staff Training",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: false,
    },
    {
        name: "Indirect Time - Insurance Authorization/Appeals",
        category: "Admin/Indirect",
        cptCodes: "",
        defaultModifier: "",
        staffRolesAllowed: ["Admin"],
        locationsAllowed: ["Clinic"],
        isBillable: false,
    },
];

const parseCptCodes = (cptCodes) => {
    if (!cptCodes) {
        return [];
    }

    const matches = cptCodes.match(/\b\d{5}\b/g);
    return matches ? Array.from(new Set(matches)) : [];
};

const inferBestFitModifier = ({ staffRolesAllowed, locationsAllowed }) => {
    const roles = new Set(staffRolesAllowed || []);
    const locations = new Set(locationsAllowed || []);

    if (locations.size === 1 && locations.has("Telehealth")) {
        return "95";
    }

    if (roles.has("BCBA")) {
        return "HP";
    }

    if (roles.has("Technician/RBT")) {
        return "HM";
    }

    return "";
};

const buildModifierObject = (defaultModifier, fallbackContext) => {
    const raw = (defaultModifier || "").trim();

    const tokens = raw
        .split("+")
        .map((entry) => entry.trim())
        .filter((entry) => entry && entry !== "-" && entry !== "--" && entry !== "-");

    const normalizedTokens = tokens.length > 0
        ? tokens.map((token) => {
            const upperToken = token.toUpperCase();
            return MODIFIER_OPTIONS.has(upperToken) ? upperToken : token;
        })
        : (() => {
            const inferred = inferBestFitModifier(fallbackContext);
            return inferred ? [inferred] : [];
        })();

    return normalizedTokens.reduce((acc, token, index) => {
        acc[`modifier${index + 1}`] = token;
        return acc;
    }, {});
};

const buildServiceCodePayload = (tenantId) => {
    const codeMap = new Map();

    for (const sessionType of SESSION_TYPE_SEED) {
        const cptCodes = parseCptCodes(sessionType.cptCodes);

        for (const code of cptCodes) {
            if (!codeMap.has(code)) {
                codeMap.set(code, {
                    tenantId,
                    code,
                    description: `Seeded from session type defaults (${code})`,
                    modifiers: buildModifierObject(sessionType.defaultModifier, sessionType),
                    isDeleted: false,
                    isActive: true,
                });
            }
        }
    }

    return Array.from(codeMap.values());
};

export const seedTenantBillingDefaults = async ({ tenantId, tx, pipelineStageId, assignToAdmin, staffData, defaultDuration = 60 }) => {
    const pipeline = await tx.Pipeline.create({
        data: {
            module: "CLIENT",
            name: "Pipeline",
            description: "Manage your client intake process seamlessly",
            createdByTenantId: tenantId,
        },
    });

    const pipelineItem = await tx.PipelineItem.create({
        data: {
            tenantId,
            pipelineStageId,
            assignToAdmin,
        },
    });

    const role = await tx.role.create({
        data: {
            name: "Admin",
            dataAccessLevel: "GLOBAL",
            systemModule: "TENANT",
            createdByTenantId: tenantId,
        },
    });

    const staff = await tx.tenantStaff.create({
        data: { ...staffData, tenantId, roleId: role.id },
    });

    await tx.roundingRules.create({
        data: {
            tenantId,
            ...ROUNDING_RULE_SEED,
        },
    });

    await tx.organizationDiagnosisCodes.createMany({
        data: ORGANIZATION_DIAGNOSIS_CODE_SEED.map((diagnosis) => ({
            tenantId,
            description: diagnosis.description,
            code: diagnosis.code,
            isActive: diagnosis.isActive,
        })),
    });

    const serviceCodeSeed = buildServiceCodePayload(tenantId);

    const createdServiceCodes = await Promise.all(
        serviceCodeSeed.map((serviceCode) => tx.serviceCodes.create({ data: serviceCode }))
    );

    const codeIdByValue = new Map(createdServiceCodes.map((row) => [row.code, row.id]));

    for (const sessionType of SESSION_TYPE_SEED) {
        const createdSessionType = await tx.organizationSessionTypes.create({
            data: {
                tenantId,
                name: sessionType.name,
                category: sessionType.category,
                staffRolesAllowed: sessionType.staffRolesAllowed,
                locationsAllowed: sessionType.locationsAllowed,
                defaultDuration,
                isActive: true,
                isBillable: sessionType.isBillable,
            },
        });

        const cptCodes = parseCptCodes(sessionType.cptCodes);
        const modifiers = buildModifierObject(sessionType.defaultModifier, sessionType);

        for (const cptCode of cptCodes) {
            const serviceCodeId = codeIdByValue.get(cptCode);

            if (!serviceCodeId) {
                continue;
            }

            await tx.sessionTypeService.create({
                data: {
                    serviceCodeId,
                    sessionTypeId: createdSessionType.id,
                    modifiers,
                },
            });
        }
    }

    return { pipelineItem, staff };
};
