import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2024-06-20" as any, // Using type 'any' to avoid strict version mismatch errors in different stripe-node versions
    appInfo: {
        name: "Fitness Tracker App",
        version: "0.1.0",
    },
});
