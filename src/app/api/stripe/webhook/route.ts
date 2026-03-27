import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// We need an admin client to bypass RLS in the webhook
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) return new NextResponse("Webhook secret or signature missing", { status: 400 });
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
                {
                    const subscription = event.data.object as Stripe.Subscription;
                    const userId = subscription.metadata.userId;

                    if (userId) {
                        await supabaseAdmin
                            .from('profiles')
                            .update({
                                stripe_customer_id: subscription.customer as string,
                                subscription_status: subscription.status,
                            })
                            .eq('id', userId);
                    }
                    break;
                }
            case "customer.subscription.deleted":
                {
                    const deletedSub = event.data.object as Stripe.Subscription;
                    const deletedUserId = deletedSub.metadata.userId;

                    if (deletedUserId) {
                        await supabaseAdmin
                            .from('profiles')
                            .update({
                                subscription_status: 'canceled',
                            })
                            .eq('id', deletedUserId);
                    }
                    break;
                }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error(error);
        return new NextResponse("Webhook handler failed.", { status: 500 });
    }
}
