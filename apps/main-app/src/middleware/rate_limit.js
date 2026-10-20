import rateLimit from "express-rate-limit";

// These endpoints are reachable without any staff/admin auth (they're gated
// only by a payment-link token or a Stripe webhook signature), so they need
// their own throttling independent of the caller's identity.
export const paymentLinkRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many payment requests. Please try again later." },
});

// Throttle credential-guessing attempts against login endpoints.
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts. Please try again later." },
});

export const webhookRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests." },
});
