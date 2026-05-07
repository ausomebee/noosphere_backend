-- CreateEnum
CREATE TYPE "Module" AS ENUM ('ADMIN', 'TENANT', 'CLIENT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'PENDING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('ENTERPRISE', 'STANDARD');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Paid', 'Upcoming', 'Due', 'Overdue');

-- CreateEnum
CREATE TYPE "incoiceBillingFrequency" AS ENUM ('Monthly', 'Yearly');

-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('SKILL_ACQUISITION', 'BEHAVIOR_REDUCTION');

-- CreateEnum
CREATE TYPE "DocumentRequestStatus" AS ENUM ('UPLOADED', 'PENDING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ClinicalReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SIGNED', 'APPROVED', 'AWAITING_SIGNATURE', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "TokenOwnerType" AS ENUM ('ADMIN', 'STAFF', 'CLIENT');

-- CreateEnum
CREATE TYPE "ClientFormStatus" AS ENUM ('PENDING', 'FILLED');

-- CreateEnum
CREATE TYPE "FeatureModule" AS ENUM ('DASHBOARD', 'SCHEDULER', 'CLIENTS', 'MY_ORGANIZATION', 'BILLINGS_PAYMENTS', 'PAYROLL', 'PROGRAM_LIBRARY', 'CUSTOM_FORMS', 'REPORTS', 'HELP_SUPPORT', 'SETTINGS');

-- CreateEnum
CREATE TYPE "PaymentSchedule" AS ENUM ('SALARIED', 'HOURLY', 'DAILY');

-- CreateEnum
CREATE TYPE "DataAccessLevel" AS ENUM ('GLOBAL', 'INDIVIDUAL', 'TEAM');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'TENANT_STAFF', 'CLIENT');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT 'jhc',
    "lastName" TEXT NOT NULL DEFAULT 'hd',
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "superAdmin" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "administratorPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authType" TEXT,
    "authQuestion" TEXT,
    "auth2FADone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" "Module" NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdByAdminId" TEXT,
    "teamLeadId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentMembers" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "DepartmentMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataAccessLevel" "DataAccessLevel" NOT NULL,
    "systemModule" "Module" NOT NULL,
    "createdByAdminId" TEXT,
    "createdByTenantId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleModuleAccess" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "module" "FeatureModule" NOT NULL,
    "permissions" JSONB[],

    CONSTRAINT "RoleModuleAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerType" "TokenOwnerType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "subdomain" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "companySize" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "leadSource" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "website" TEXT,
    "assignToAdmin" TEXT,
    "practiceNPI" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantDeactivation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "deactivatedById" TEXT NOT NULL,
    "deactivatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactivationDate" TIMESTAMP(3),

    CONSTRAINT "TenantDeactivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaff" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stage" TEXT,
    "roleId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dob" TEXT,
    "gender" TEXT,
    "npi" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "authType" TEXT,
    "authQuestion" TEXT,
    "auth2FADone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantNotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teamLeadId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembers" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaffLicenses" (
    "id" TEXT NOT NULL,
    "licenseName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "issueState" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaffLicenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaffPayroll" (
    "id" TEXT NOT NULL,
    "paymentSchedule" "PaymentSchedule" NOT NULL,
    "ratePerHour" TEXT NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "minimumHours" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaffPayroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaffDocuments" (
    "id" TEXT NOT NULL,
    "documentsUrl" JSONB NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantStaffDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "DOB" TIMESTAMP(3),
    "gender" TEXT NOT NULL,
    "primaryPayer" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "caregiverName" TEXT,
    "caregiverRelationship" TEXT,
    "caregiverPhone" TEXT,
    "caregiverEmail" TEXT,
    "caregiverStreetAddress" TEXT,
    "caregiverCity" TEXT,
    "caregiverState" TEXT,
    "caregiverCountry" TEXT,
    "caregiverZip" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientTenant" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "dbAccess" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "stage" TEXT NOT NULL,
    "requestAppointment" BOOLEAN NOT NULL DEFAULT true,
    "documentAccess" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "passwordChanged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientDocuments" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentDetails" JSONB NOT NULL,
    "requestId" TEXT,
    "isDeleted" BOOLEAN NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientRequestedDocuments" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "allowMultiple" BOOLEAN NOT NULL,
    "status" "DocumentRequestStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientRequestedDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientNotificationSettings" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "appointmentScheduled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentRescheduled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentAboutToStart" BOOLEAN NOT NULL DEFAULT true,
    "appointmentStarted" BOOLEAN NOT NULL DEFAULT true,
    "appointmentCancelled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentCompletedAwaitingFeedback" BOOLEAN NOT NULL DEFAULT true,
    "documentRequested" BOOLEAN NOT NULL DEFAULT true,
    "formShared" BOOLEAN NOT NULL DEFAULT true,
    "authorizationAboutToExpire" BOOLEAN NOT NULL DEFAULT true,
    "authorizationExpired" BOOLEAN NOT NULL DEFAULT true,
    "authorizationUnitsAlmostExhausted" BOOLEAN NOT NULL DEFAULT true,
    "authorizationUnitsExhausted" BOOLEAN NOT NULL DEFAULT true,
    "signatureRequested" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "module" "Module" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdByAdminId" TEXT,
    "createdByTenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineStage" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "colourCode" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiredTasks" JSONB,
    "requiredDocuments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "clientId" TEXT,
    "pipelineStageId" TEXT NOT NULL,
    "assignToAdmin" TEXT,
    "assignToTenantStaff" TEXT,
    "doneTasks" JSONB,
    "sentDocuments" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineDoneTask" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineDoneTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineSubmittedDocument" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineSubmittedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingMetadata" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,

    CONSTRAINT "BillingMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "billingMetadataId" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "pauseSchedule" TIMESTAMP(3),
    "resumeShedule" TIMESTAMP(3),
    "autoRenew" BOOLEAN DEFAULT true,
    "mailNotification" BOOLEAN,
    "endDate" TIMESTAMP(3) NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingPlan" (
    "id" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "name" TEXT NOT NULL,
    "colourCode" TEXT NOT NULL,
    "description" TEXT,
    "pricePerMonth" JSONB NOT NULL,
    "pricePerYear" JSONB NOT NULL,
    "forClient" INTEGER NOT NULL,
    "extraFeaturesWithPrice" JSONB,
    "forStaff" INTEGER NOT NULL,
    "forStorage" DOUBLE PRECISION NOT NULL,
    "extraFeaturesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "featureGroupId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "managedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperAdminChoices" (
    "id" TEXT NOT NULL,
    "Authenticator2FA" BOOLEAN NOT NULL,
    "securityQuestion" BOOLEAN NOT NULL,
    "setForAll" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperAdminChoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantAdminChoices" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "Authenticator2FA" BOOLEAN NOT NULL,
    "securityQuestion" BOOLEAN NOT NULL,
    "setForAll" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantAdminChoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionId" TEXT,
    "transactionRef" TEXT,
    "gateway" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethodId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "logId" TEXT NOT NULL,
    "tenantId" TEXT,
    "clientId" TEXT,
    "adminId" TEXT,
    "feature" TEXT,
    "module" "Module",
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "subscriptionId" TEXT,
    "issueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("logId")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "planId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "billingFrequency" "incoiceBillingFrequency" NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceToken" (
    "id" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvoiceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "lastFourDigits" TEXT NOT NULL,
    "holderName" TEXT,
    "tenantId" TEXT NOT NULL,
    "gatewayToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceManagement" (
    "id" TEXT NOT NULL,
    "onPlanPurchase" BOOLEAN NOT NULL,
    "daysBeforeDueDate" INTEGER NOT NULL,
    "upcomingInvoiceHeader" TEXT NOT NULL,
    "upcomingInvoiceBody" TEXT NOT NULL,
    "onDueDate" BOOLEAN NOT NULL,
    "dueInvoiceHeader" TEXT NOT NULL,
    "dueInvoiceBody" TEXT NOT NULL,
    "markOverDue" INTEGER NOT NULL,
    "unpaidReminderTimesBefore" INTEGER NOT NULL,
    "attachInvoiceToReminder" BOOLEAN NOT NULL,
    "reminderEmail" JSONB NOT NULL,

    CONSTRAINT "InvoiceManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAndAccountAccess" (
    "id" TEXT NOT NULL,
    "chargeOnDueDate" BOOLEAN NOT NULL,
    "chargeLastUsedFirst" BOOLEAN NOT NULL,
    "chargeAlternative" BOOLEAN NOT NULL,
    "retryBefore" INTEGER NOT NULL,
    "retryAfter" INTEGER NOT NULL,
    "notifyTenant" BOOLEAN NOT NULL,
    "notificationEmailHeader" TEXT NOT NULL,
    "notificationEmailBody" TEXT NOT NULL,
    "cancelAfter" INTEGER NOT NULL,
    "manualCancel" BOOLEAN NOT NULL,
    "suspensionAction" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "emailAfterAttempts" INTEGER NOT NULL,
    "warningMailHeader" TEXT NOT NULL,
    "warningMailBody" TEXT NOT NULL,
    "sendOnSubscriptionCancel" BOOLEAN NOT NULL,
    "cancelMailHeader" TEXT NOT NULL,
    "cancelMailBody" TEXT NOT NULL,

    CONSTRAINT "PaymentAndAccountAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT,
    "tenantId" TEXT NOT NULL,
    "adminId" TEXT,
    "title" TEXT NOT NULL,
    "adminLoggedById" TEXT,
    "status" TEXT NOT NULL,
    "resolutionDeadline" TIMESTAMP(3),
    "attachments" JSONB,
    "description" TEXT NOT NULL,
    "resolutionDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueComment" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "domainType" "DomainType" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domainId" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "programId" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "sd" TEXT NOT NULL,
    "expectedResponse" TEXT NOT NULL,
    "teachingProcedure" TEXT NOT NULL,
    "promptingStrategy" JSONB NOT NULL,
    "dataCollectionType" TEXT NOT NULL,
    "baselineDataRequired" BOOLEAN NOT NULL,
    "numberOfTrials" INTEGER,
    "numberOfTasks" INTEGER,
    "taskSteps" JSONB,
    "masteryMetric" TEXT NOT NULL,
    "masteryCriteria" JSONB NOT NULL,
    "initialStatus" TEXT NOT NULL,
    "attachment" TEXT,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProgram" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientTarget" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientTargetDataCollection" (
    "id" TEXT NOT NULL,
    "clientTargetId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientTargetDataCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationInformation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "practiceNPI" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "OrganizationInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLicenses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "licenseName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issueState" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationLicenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDocuments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDiagnosisCodes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "OrganizationDiagnosisCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSessionTypes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "staffRolesAllowed" JSONB NOT NULL,
    "locationsAllowed" JSONB NOT NULL,
    "defaultDuration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isBillable" BOOLEAN NOT NULL,

    CONSTRAINT "OrganizationSessionTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionTypeService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "sessionTypeId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,

    CONSTRAINT "SessionTypeService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "recurrence" JSONB NOT NULL,
    "isBillable" BOOLEAN NOT NULL,
    "serviceLocation" TEXT NOT NULL,
    "requiresTravel" BOOLEAN NOT NULL,
    "colourCode" TEXT NOT NULL,
    "relatedAppointment" TEXT,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    "reasonForCancel" TEXT,
    "reasonForReschedule" TEXT,
    "rescheduled" BOOLEAN NOT NULL DEFAULT false,
    "rescheduleAccepted" BOOLEAN NOT NULL DEFAULT false,
    "rescheduleRejected" BOOLEAN NOT NULL DEFAULT false,
    "clientRescheduleAccepted" BOOLEAN NOT NULL DEFAULT false,
    "clientRescheduleRejected" BOOLEAN NOT NULL DEFAULT false,
    "canceledBy" TEXT,
    "cancelTime" TIMESTAMP(3),
    "previousDate" TEXT,
    "previousStartTime" TEXT,
    "previousEndTime" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCodes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoundingRules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "standardUnit" INTEGER,
    "roundingRule" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RoundingRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceType" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InsuranceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "insuranceTypeId" TEXT NOT NULL,
    "tplCode" TEXT NOT NULL,
    "carrierPayerId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "serviceCodes" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Payer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayerServiceCodes" (
    "id" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "unitCurrency" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "ratePerUnit" INTEGER NOT NULL,
    "roundingRuleId" TEXT NOT NULL,
    "billable" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PayerServiceCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompensationTypes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CompensationTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeItems" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "IncomeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deductions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT,
    "compensationType" "PaymentSchedule",
    "interval" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "autoRun" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PayrollCycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycleStaffs" (
    "id" TEXT NOT NULL,
    "payrollCycleId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "paymentSchedule" "PaymentSchedule" NOT NULL,
    "ratePerHour" TEXT NOT NULL,
    "minimumHours" TEXT,

    CONSTRAINT "PayrollCycleStaffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycleStaffIncomeItems" (
    "id" TEXT NOT NULL,
    "payrollCycleStaffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,

    CONSTRAINT "PayrollCycleStaffIncomeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycleStaffDeductions" (
    "id" TEXT NOT NULL,
    "payrollCycleStaffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,

    CONSTRAINT "PayrollCycleStaffDeductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "tenantClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormFields" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "options" JSONB,
    "fileUpload" JSONB,
    "starRating" JSONB,
    "signature" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FormFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "submittedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseFields" (
    "id" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FormResponseFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAuthorization" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorizationNumber" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClientAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAuthorizationService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "clientAuthorizationId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "units" INTEGER NOT NULL,
    "usedUnit" INTEGER NOT NULL DEFAULT 0,
    "per" TEXT NOT NULL,

    CONSTRAINT "ClientAuthorizationService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientForm" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "status" "ClientFormStatus" NOT NULL DEFAULT 'PENDING',
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAvailability" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "StaffAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityDays" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "WeekDay" NOT NULL,
    "available" BOOLEAN NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,

    CONSTRAINT "AvailabilityDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "supervisorApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "clientApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "supervisorId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "travelStartTime" TIMESTAMP(3),
    "travelEndTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionData" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionApproval" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "confirmDelivery" BOOLEAN NOT NULL,
    "rateService" INTEGER NOT NULL DEFAULT 0,
    "rateTherapist" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimesheetHistory" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimesheetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionUpdateRequest" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionUpdateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientTenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientFiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "clientTenantId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportTemplates" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReportTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportTemplateSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "ClinicalReportTemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientTenantId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "approverId" TEXT,
    "tenantId" TEXT NOT NULL,
    "status" "ClinicalReportStatus" NOT NULL DEFAULT 'DRAFT',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "clinicalReportId" TEXT NOT NULL,

    CONSTRAINT "ClinicalReportSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportHistory" (
    "id" TEXT NOT NULL,
    "clinicalReportId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalReportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportChangeRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "clinicalReportId" TEXT NOT NULL,
    "clientTenantId" TEXT,
    "approverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReportChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportVersion" (
    "id" TEXT NOT NULL,
    "clinicalReportId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalReportVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantGeneralSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "timeFormat" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantGeneralSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantAdditionalSecurityQuestions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantAdditionalSecurityQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderType" "UserType" NOT NULL,
    "receiverId" TEXT NOT NULL,
    "receiverType" "UserType" NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "adminId" TEXT,
    "tenantStaffId" TEXT,
    "tenantClientId" TEXT,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientClinicians" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientClinicians_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlanFeatures" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlanFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExtraFeatures" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExtraFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AppointmentClinicians" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppointmentClinicians_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PayrollIncomItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PayrollIncomItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PayrollDeductions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PayrollDeductions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SessionAuthorizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SessionAuthorizations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phoneNumber_key" ON "Admin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_phoneNumber_key" ON "Tenant"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "TenantDeactivation_tenantId_key" ON "TenantDeactivation"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantStaff_email_key" ON "TenantStaff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TenantStaff_phoneNumber_key" ON "TenantStaff"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TenantNotificationSettings_userId_key" ON "TenantNotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phoneNumber_key" ON "Client"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientTenant_clientId_tenantId_key" ON "ClientTenant"("clientId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientNotificationSettings_tenantClientId_key" ON "ClientNotificationSettings"("tenantClientId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingMetadata_tenantId_key" ON "BillingMetadata"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paymentId_key" ON "Subscription"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantAdminChoices_tenantId_key" ON "TenantAdminChoices"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProgram_clientId_programId_key" ON "ClientProgram"("clientId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInformation_tenantId_key" ON "OrganizationInformation"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientForm_tenantClientId_formId_key" ON "ClientForm"("tenantClientId", "formId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantGeneralSettings_tenantId_key" ON "TenantGeneralSettings"("tenantId");

-- CreateIndex
CREATE INDEX "_ClientClinicians_B_index" ON "_ClientClinicians"("B");

-- CreateIndex
CREATE INDEX "_PlanFeatures_B_index" ON "_PlanFeatures"("B");

-- CreateIndex
CREATE INDEX "_ExtraFeatures_B_index" ON "_ExtraFeatures"("B");

-- CreateIndex
CREATE INDEX "_AppointmentClinicians_B_index" ON "_AppointmentClinicians"("B");

-- CreateIndex
CREATE INDEX "_PayrollIncomItems_B_index" ON "_PayrollIncomItems"("B");

-- CreateIndex
CREATE INDEX "_PayrollDeductions_B_index" ON "_PayrollDeductions"("B");

-- CreateIndex
CREATE INDEX "_SessionAuthorizations_B_index" ON "_SessionAuthorizations"("B");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembers" ADD CONSTRAINT "DepartmentMembers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembers" ADD CONSTRAINT "DepartmentMembers_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByTenantId_fkey" FOREIGN KEY ("createdByTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleModuleAccess" ADD CONSTRAINT "RoleModuleAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_assignToAdmin_fkey" FOREIGN KEY ("assignToAdmin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantDeactivation" ADD CONSTRAINT "TenantDeactivation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantDeactivation" ADD CONSTRAINT "TenantDeactivation_deactivatedById_fkey" FOREIGN KEY ("deactivatedById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaff" ADD CONSTRAINT "TenantStaff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaff" ADD CONSTRAINT "TenantStaff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantNotificationSettings" ADD CONSTRAINT "TenantNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaffLicenses" ADD CONSTRAINT "TenantStaffLicenses_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaffPayroll" ADD CONSTRAINT "TenantStaffPayroll_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaffDocuments" ADD CONSTRAINT "TenantStaffDocuments_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_primaryPayer_fkey" FOREIGN KEY ("primaryPayer") REFERENCES "Payer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTenant" ADD CONSTRAINT "ClientTenant_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTenant" ADD CONSTRAINT "ClientTenant_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTenant" ADD CONSTRAINT "ClientTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDocuments" ADD CONSTRAINT "ClientDocuments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDocuments" ADD CONSTRAINT "ClientDocuments_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDocuments" ADD CONSTRAINT "ClientDocuments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ClientRequestedDocuments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRequestedDocuments" ADD CONSTRAINT "ClientRequestedDocuments_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNotificationSettings" ADD CONSTRAINT "ClientNotificationSettings_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_createdByTenantId_fkey" FOREIGN KEY ("createdByTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_pipelineStageId_fkey" FOREIGN KEY ("pipelineStageId") REFERENCES "PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_assignToTenantStaff_fkey" FOREIGN KEY ("assignToTenantStaff") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItem" ADD CONSTRAINT "PipelineItem_assignToAdmin_fkey" FOREIGN KEY ("assignToAdmin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineDoneTask" ADD CONSTRAINT "PipelineDoneTask_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineSubmittedDocument" ADD CONSTRAINT "PipelineSubmittedDocument_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingMetadata" ADD CONSTRAINT "BillingMetadata_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_billingMetadataId_fkey" FOREIGN KEY ("billingMetadataId") REFERENCES "BillingMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "BillingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPlan" ADD CONSTRAINT "BillingPlan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPlan" ADD CONSTRAINT "BillingPlan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_featureGroupId_fkey" FOREIGN KEY ("featureGroupId") REFERENCES "FeatureGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantAdminChoices" ADD CONSTRAINT "TenantAdminChoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_planId_fkey" FOREIGN KEY ("planId") REFERENCES "BillingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceToken" ADD CONSTRAINT "InvoiceToken_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adminLoggedById_fkey" FOREIGN KEY ("adminLoggedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProgram" ADD CONSTRAINT "ClientProgram_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProgram" ADD CONSTRAINT "ClientProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTarget" ADD CONSTRAINT "ClientTarget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTarget" ADD CONSTRAINT "ClientTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTargetDataCollection" ADD CONSTRAINT "ClientTargetDataCollection_clientTargetId_fkey" FOREIGN KEY ("clientTargetId") REFERENCES "ClientTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInformation" ADD CONSTRAINT "OrganizationInformation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLicenses" ADD CONSTRAINT "OrganizationLicenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocuments" ADD CONSTRAINT "OrganizationDocuments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDiagnosisCodes" ADD CONSTRAINT "OrganizationDiagnosisCodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSessionTypes" ADD CONSTRAINT "OrganizationSessionTypes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTypeService" ADD CONSTRAINT "SessionTypeService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTypeService" ADD CONSTRAINT "SessionTypeService_sessionTypeId_fkey" FOREIGN KEY ("sessionTypeId") REFERENCES "OrganizationSessionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OrganizationSessionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_relatedAppointment_fkey" FOREIGN KEY ("relatedAppointment") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCodes" ADD CONSTRAINT "ServiceCodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundingRules" ADD CONSTRAINT "RoundingRules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceType" ADD CONSTRAINT "InsuranceType_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_roundingRuleId_fkey" FOREIGN KEY ("roundingRuleId") REFERENCES "RoundingRules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Payer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationTypes" ADD CONSTRAINT "CompensationTypes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeItems" ADD CONSTRAINT "IncomeItems_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deductions" ADD CONSTRAINT "Deductions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycles" ADD CONSTRAINT "PayrollCycles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffs" ADD CONSTRAINT "PayrollCycleStaffs_payrollCycleId_fkey" FOREIGN KEY ("payrollCycleId") REFERENCES "PayrollCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffs" ADD CONSTRAINT "PayrollCycleStaffs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffIncomeItems" ADD CONSTRAINT "PayrollCycleStaffIncomeItems_payrollCycleStaffId_fkey" FOREIGN KEY ("payrollCycleStaffId") REFERENCES "PayrollCycleStaffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffDeductions" ADD CONSTRAINT "PayrollCycleStaffDeductions_payrollCycleStaffId_fkey" FOREIGN KEY ("payrollCycleStaffId") REFERENCES "PayrollCycleStaffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormFields" ADD CONSTRAINT "FormFields_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseFields" ADD CONSTRAINT "FormResponseFields_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseFields" ADD CONSTRAINT "FormResponseFields_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_payer_fkey" FOREIGN KEY ("payer") REFERENCES "Payer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_insuranceType_fkey" FOREIGN KEY ("insuranceType") REFERENCES "InsuranceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationService" ADD CONSTRAINT "ClientAuthorizationService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationService" ADD CONSTRAINT "ClientAuthorizationService_clientAuthorizationId_fkey" FOREIGN KEY ("clientAuthorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientForm" ADD CONSTRAINT "ClientForm_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientForm" ADD CONSTRAINT "ClientForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAvailability" ADD CONSTRAINT "StaffAvailability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityDays" ADD CONSTRAINT "AvailabilityDays_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "StaffAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionData" ADD CONSTRAINT "SessionData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionData" ADD CONSTRAINT "SessionData_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionApproval" ADD CONSTRAINT "SessionApproval_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetHistory" ADD CONSTRAINT "TimesheetHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetHistory" ADD CONSTRAINT "TimesheetHistory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionUpdateRequest" ADD CONSTRAINT "SessionUpdateRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionUpdateRequest" ADD CONSTRAINT "SessionUpdateRequest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFolder" ADD CONSTRAINT "ClientFolder_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ClientFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportTemplates" ADD CONSTRAINT "ClinicalReportTemplates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportTemplateSection" ADD CONSTRAINT "ClinicalReportTemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ClinicalReportTemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportSection" ADD CONSTRAINT "ClinicalReportSection_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportHistory" ADD CONSTRAINT "ClinicalReportHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportHistory" ADD CONSTRAINT "ClinicalReportHistory_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportVersion" ADD CONSTRAINT "ClinicalReportVersion_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantGeneralSettings" ADD CONSTRAINT "TenantGeneralSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantAdditionalSecurityQuestions" ADD CONSTRAINT "TenantAdditionalSecurityQuestions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientClinicians" ADD CONSTRAINT "_ClientClinicians_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientTenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientClinicians" ADD CONSTRAINT "_ClientClinicians_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanFeatures" ADD CONSTRAINT "_PlanFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "BillingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanFeatures" ADD CONSTRAINT "_PlanFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraFeatures" ADD CONSTRAINT "_ExtraFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "BillingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraFeatures" ADD CONSTRAINT "_ExtraFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentClinicians" ADD CONSTRAINT "_AppointmentClinicians_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentClinicians" ADD CONSTRAINT "_AppointmentClinicians_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollIncomItems" ADD CONSTRAINT "_PayrollIncomItems_A_fkey" FOREIGN KEY ("A") REFERENCES "IncomeItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollIncomItems" ADD CONSTRAINT "_PayrollIncomItems_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaffPayroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollDeductions" ADD CONSTRAINT "_PayrollDeductions_A_fkey" FOREIGN KEY ("A") REFERENCES "Deductions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollDeductions" ADD CONSTRAINT "_PayrollDeductions_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaffPayroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionAuthorizations" ADD CONSTRAINT "_SessionAuthorizations_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientAuthorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionAuthorizations" ADD CONSTRAINT "_SessionAuthorizations_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
