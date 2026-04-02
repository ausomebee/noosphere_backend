class ClientNotificationSettings {
    constructor({
        id,
        tenantClientId,
        appointmentScheduled,
        appointmentRescheduled,
        appointmentAboutToStart,
        appointmentStarted,
        appointmentCancelled,
        appointmentCompletedAwaitingFeedback,
        documentRequested,
        formShared,
        authorizationAboutToExpire,
        authorizationExpired,
        authorizationUnitsAlmostExhausted,
        authorizationUnitsExhausted,
        signatureRequested,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.tenantClientId = tenantClientId;

        this.appointmentScheduled = appointmentScheduled;
        this.appointmentRescheduled = appointmentRescheduled;
        this.appointmentAboutToStart = appointmentAboutToStart;
        this.appointmentStarted = appointmentStarted;
        this.appointmentCancelled = appointmentCancelled;
        this.appointmentCompletedAwaitingFeedback = appointmentCompletedAwaitingFeedback;

        this.documentRequested = documentRequested;
        this.formShared = formShared;

        this.authorizationAboutToExpire = authorizationAboutToExpire;
        this.authorizationExpired = authorizationExpired;
        this.authorizationUnitsAlmostExhausted = authorizationUnitsAlmostExhausted;
        this.authorizationUnitsExhausted = authorizationUnitsExhausted;

        this.signatureRequested = signatureRequested;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createNotificationSettings() {
        return {
            tenantClientId: this.tenantClientId,

            appointmentScheduled: this.appointmentScheduled,
            appointmentRescheduled: this.appointmentRescheduled,
            appointmentAboutToStart: this.appointmentAboutToStart,
            appointmentStarted: this.appointmentStarted,
            appointmentCancelled: this.appointmentCancelled,
            appointmentCompletedAwaitingFeedback: this.appointmentCompletedAwaitingFeedback,

            documentRequested: this.documentRequested,
            formShared: this.formShared,

            authorizationAboutToExpire: this.authorizationAboutToExpire,
            authorizationExpired: this.authorizationExpired,
            authorizationUnitsAlmostExhausted: this.authorizationUnitsAlmostExhausted,
            authorizationUnitsExhausted: this.authorizationUnitsExhausted,

            signatureRequested: this.signatureRequested
        };
    }
}

export default ClientNotificationSettings;