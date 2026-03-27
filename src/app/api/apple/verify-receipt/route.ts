import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ensure we have Admin access for bypassing RLS to update subscriptions
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
    try {
        const { receiptData, userId } = await req.json();

        if (!receiptData || !userId) {
            return new NextResponse("Missing receipt data or user ID", { status: 400 });
        }

        const sharedSecret = process.env.APPLE_SHARED_SECRET;

        let isSandbox = process.env.NODE_ENV !== "production";
        let verifyUrl = isSandbox
            ? "https://sandbox.itunes.apple.com/verifyReceipt"
            : "https://buy.itunes.apple.com/verifyReceipt";

        const requestBody = {
            "receipt-data": receiptData,
            "password": sharedSecret,
            "exclude-old-transactions": true
        };

        // First attempt to verify
        let response = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        let data = await response.json();

        // Status 21007 means it was a sandbox receipt sent to production.
        // If we are in production and users use TestFlight, Apple expects us to fall back to Sandbox.
        if (data.status === 21007 && !isSandbox) {
            verifyUrl = "https://sandbox.itunes.apple.com/verifyReceipt";
            response = await fetch(verifyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
            data = await response.json();
        }

        if (data.status !== 0) {
            console.error("Apple Receipt Validation Failed. Status code:", data.status);
            return new NextResponse("Invalid receipt", { status: 400 });
        }

        // Successfully validated receipt!
        // Retrieve the latest receipt info
        const latestReceiptInfo = data.latest_receipt_info;

        if (latestReceiptInfo && latestReceiptInfo.length > 0) {
            // Apple latest_receipt_info is usually ordered, but best to find the most recent expires_date
            const sortedReceipts = latestReceiptInfo.sort((a: any, b: any) =>
                parseInt(b.expires_date_ms, 10) - parseInt(a.expires_date_ms, 10)
            );

            const latestTransaction = sortedReceipts[0];
            const now = Date.now();
            const expiresDate = parseInt(latestTransaction.expires_date_ms, 10);

            if (expiresDate > now) {
                // Subscription is active! Update Supabase
                await supabaseAdmin
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                    })
                    .eq('id', userId);

                return NextResponse.json({ success: true, status: 'active', expiresDate });
            } else {
                // Subscription expired
                await supabaseAdmin
                    .from('profiles')
                    .update({
                        subscription_status: 'canceled',
                    })
                    .eq('id', userId);

                return NextResponse.json({ success: true, status: 'expired' });
            }
        }

        return new NextResponse("No active subscription found in receipt", { status: 400 });

    } catch (err: any) {
        console.error("IAP Verification Error:", err.message);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
