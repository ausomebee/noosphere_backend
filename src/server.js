import "./config/env.js";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import errorHandler from "./middleware/error-handler.js";
import prismaService from "./config/prisma.js";
import socketService from "./config/socket.js"
import PassportUtil from "./config/passport.js";
import department_route from "./features/department/presentation/routes/departmentRoute.js"
import admin_route from "./features/admin/presentation/routes/adminRoute.js"
import role_route from "./features/role/presentation/routes/roleRoute.js"
import pipeline_route from "./features/pipeline/presentation/routes/pipelineRoute.js"
import tenant_route from "./features/tenant/presentation/routes/tenantRoute.js"
import client_route from "./features/client/presentation/routes/clientRoute.js"
import auth_route from "./features/auth/presentation/routes/authRoute.js"
import billing_route from "./features/billing/presentation/routes/billingRoute.js"
import feature_route from "./features/planAndFeature/presentation/routes/featureRoute.js"
import plan_route from "./features/planAndFeature/presentation/routes/planRoute.js"
import subscription_route from "./features/planAndFeature/presentation/routes/subscriptionRoute.js"
import invoice_route from "./features/invoice/presentation/routes/invoiceRoute.js"
import log_route from "./features/logs/presentation/routes/logRoute.js"
import performance_route from "./features/performance/presentation/routes/performanceRoute.js"
import issue_route from "./features/issue/presentation/routes/issueRoute.js"
import program_route from "./features/program/presentation/routes/programRoute.js"
import domain_route from "./features/program/presentation/routes/domainRoute.js"
import target_route from "./features/program/presentation/routes/targetRoute.js"
import target_data_route from "./features/program/presentation/routes/targetDataRoute.js";
import client_program_route from "./features/program/presentation/routes/clientProgramRoute.js";
import client_target_route from "./features/program/presentation/routes/clientTargetRoute.js";
import organization_information_route from "./features/organization/presentation/routes/informationRoute.js";
import organization_document_route from "./features/organization/presentation/routes/documentRoute.js";
import organization_license_route from "./features/organization/presentation/routes/licenseRoute.js";
import organization_session_type_route from "./features/organization/presentation/routes/sessionTypeRoute.js";
import organization_diagnosis_code_route from "./features/organization/presentation/routes/diagnosisCodeRoute.js";
import organization_staff_route from "./features/organizationStaff/presentation/routes/staffRoute.js";
import organization_staff_document_route from "./features/organizationStaff/presentation/routes/DocumentRoute.js";
import organization_staff_license_route from "./features/organizationStaff/presentation/routes/licenseRoute.js";
import organization_staff_payroll_route from "./features/organizationStaff/presentation/routes/payrollRoute.js";
import image_route from "./features/images/presentation/routes/imageRoutes.js";
import appointment_route from "./features/appointment/presentation/routes/appointmentRoute.js";
import service_codes_route from "./features/tenantBilling/presentation/routes/serviceCodesRoutes.js";
import rounding_rules_route from "./features/tenantBilling/presentation/routes/roundingRulesRoutes.js";
import insurance_type_route from "./features/tenantBilling/presentation/routes/insuranceTypeRoutes.js";
import payer_route from "./features/tenantBilling/presentation/routes/payerRoutes.js";
import payer_service_codes_route from "./features/tenantBilling/presentation/routes/payerServiceCodeRoutes.js";
import compensation_type_route from "./features/tenantPayroll/presentation/routes/compensationTypeRoutes.js";
import income_item_route from "./features/tenantPayroll/presentation/routes/incomeItemRoutes.js";
import deduction_route from "./features/tenantPayroll/presentation/routes/deductionRoutes.js";
import payroll_cycle_route from "./features/tenantPayroll/presentation/routes/payrollCycleRoutes.js";
import payroll_record_route from "./features/tenantPayroll/presentation/routes/payrollRecordRoutes.js";
import form_route from "./features/customForms/presentation/routes/formRoutes.js";
import form_field_route from "./features/customForms/presentation/routes/formFieldRoutes.js";
import form_response_route from "./features/customForms/presentation/routes/formResponseRoutes.js";
import form_response_field_route from "./features/customForms/presentation/routes/formResponseFieldRoutes.js";
import client_documents_route from "./features/client/presentation/routes/clientDocumentsRoutes.js";
import requested_documents_route from "./features/client/presentation/routes/requestedDocumentsRoutes.js";
import client_authorization_route from "./features/client/presentation/routes/clientAuthorizationRoutes.js";
import client_forms_route from "./features/customForms/presentation/routes/clientFormRoutes.js";
import availabilityDaysRoute from "./features/organization/presentation/routes/availabilityDaysRoutes.js";
import staffAvailabilityRoute from "./features/organization/presentation/routes/staffAvailabilityRoutes.js";
import sessionRoute from "./features/session/presentation/routes/sessionRoutes.js";
import sessionDataRoute from "./features/session/presentation/routes/sessionDataRoutes.js";
import sessionApprovalRoute from "./features/session/presentation/routes/sessionApprovalRoutes.js";
import timesheetHistoryRoute from "./features/session/presentation/routes/timesheetHistoryRoutes.js";
import sessionUpdateRequestRoute from "./features/session/presentation/routes/sessionUpdateRequestRoutes.js";
import clientFilesRoute from "./features/folder/presentation/routes/clientFilesRoutes.js";
import clientFolderRoute from "./features/folder/presentation/routes/clientFolderRoutes.js";

class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.prisma = prismaService;
        this.port = process.env.PORT || 5001;
        this.allowedOrigins = [
            /^https?:\/\/([a-z0-9-]+\.)*noospherehub\.net$/,
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/127\.0\.0\.1:\d+$/,
            /^http:\/\/([a-z0-9-]+\.)*localhost:\d+$/
        ];

        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    async initializeDatabase() {
        await this.prisma.connect();
    }

    initializeMiddlewares() {
        new PassportUtil(this.app)
        this.app.use(morgan("dev"));
        this.app.use((req, res, next) => {
            console.log("Incoming Origin:", req.headers.origin);
            next();
        });
        this.app.use(cors({
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);

                const isAllowed = this.allowedOrigins.some((pattern) =>
                    pattern.test(origin)
                );

                if (isAllowed) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: "GET, POST, PATCH, DELETE, PUT",
            credentials: true,
        }));
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    }

    initializeSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    initializeRoutes() {
        this.app.use("/api/v1/department", department_route);
        this.app.use("/api/v1/role", role_route);
        this.app.use("/api/v1/admin", admin_route);
        this.app.use("/api/v1/pipeline", pipeline_route);
        this.app.use("/api/v1/tenant", tenant_route);
        this.app.use("/api/v1/client", client_route);
        this.app.use("/api/v1/auth", auth_route);
        this.app.use("/api/v1/billing", billing_route);
        this.app.use("/api/v1/feature", feature_route);
        this.app.use("/api/v1/plan", plan_route);
        this.app.use("/api/v1/subscription", subscription_route);
        this.app.use("/api/v1/invoice", invoice_route);
        this.app.use("/api/v1/log", log_route);
        this.app.use("/api/v1/performance", performance_route);
        this.app.use("/api/v1/issue", issue_route);
        this.app.use("/api/v1/programs", program_route);
        this.app.use("/api/v1/domains", domain_route);
        this.app.use("/api/v1/targets", target_route);
        this.app.use("/api/v1/target-data", target_data_route);
        this.app.use("/api/v1/client-programs", client_program_route);
        this.app.use("/api/v1/client-targets", client_target_route);
        this.app.use("/api/v1/organization/information", organization_information_route);
        this.app.use("/api/v1/organization/document", organization_document_route);
        this.app.use("/api/v1/organization/license", organization_license_route);
        this.app.use("/api/v1/organization/diagnosis-codes", organization_diagnosis_code_route);
        this.app.use("/api/v1/organization/session-types", organization_session_type_route);
        this.app.use("/api/v1/organization-staff/document", organization_staff_document_route);
        this.app.use("/api/v1/organization-staff/license", organization_staff_license_route);
        this.app.use("/api/v1/organization-staff/payroll", organization_staff_payroll_route);
        this.app.use("/api/v1/organization-staff/staff", organization_staff_route);
        this.app.use("/api/v1/images", image_route);
        this.app.use("/api/v1/appointments", appointment_route);
        this.app.use("/api/v1/service-codes", service_codes_route);
        this.app.use("/api/v1/rounding-rules", rounding_rules_route);
        this.app.use("/api/v1/insurance-types", insurance_type_route);
        this.app.use("/api/v1/payers", payer_route);
        this.app.use("/api/v1/payer-service-codes", payer_service_codes_route);
        this.app.use("/api/v1/compensation-types", compensation_type_route);
        this.app.use("/api/v1/income-items", income_item_route);
        this.app.use("/api/v1/deductions", deduction_route);
        this.app.use("/api/v1/payroll-cycles", payroll_cycle_route);
        this.app.use("/api/v1/payroll-records", payroll_record_route);
        this.app.use("/api/v1/forms", form_route);
        this.app.use("/api/v1/form-fields", form_field_route);
        this.app.use("/api/v1/form-responses", form_response_route);
        this.app.use("/api/v1/form-response-fields", form_response_field_route);
        this.app.use("/api/v1/client-documents", client_documents_route);
        this.app.use("/api/v1/client-requested-documents", requested_documents_route);
        this.app.use("/api/v1/client-authorization", client_authorization_route);
        this.app.use("/api/v1/client-forms", client_forms_route);
        this.app.use("/api/v1/organization/availability-days", availabilityDaysRoute);
        this.app.use("/api/v1/organization/staff-availability", staffAvailabilityRoute);
        this.app.use("/api/v1/sessions", sessionRoute);
        this.app.use("/api/v1/session-data", sessionDataRoute);
        this.app.use("/api/v1/sessions-approval", sessionApprovalRoute);
        this.app.use("/api/v1/sessions-timesheet-history", timesheetHistoryRoute);
        this.app.use("/api/v1/sessions-update-requests", sessionUpdateRequestRoute);
        this.app.use("/api/v1/client-folders", clientFolderRoute);
        this.app.use("/api/v1/client-files", clientFilesRoute);
    }

    initializeErrorHandler() {
        this.app.use(errorHandler.handleError);
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);

            socketService.init(this.server);
            console.log("✅ WebSocket initialized");
        });
    }
}

const appInstance = new App();
appInstance.start();