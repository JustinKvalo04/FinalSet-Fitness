import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-6 sm:px-12 md:px-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Account Information:</strong> We collect your email address and basic profile information when you register an account.</li>
                    <li><strong>Usage Data:</strong> We collect information about your interactions with the app, such as your weight and strength training logs, to provide and improve our service.</li>
                    <li><strong>Subscription Status:</strong> We track your active subscription status (e.g., through Apple In-App Purchases or Stripe) to unlock premium features. No payment details are stored on our servers.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>To authenticate you and maintain your account security.</li>
                    <li>To personalize your experience, including auto-adjusting your macro targets based on your tracked weight and strength progress.</li>
                    <li>To analyze app usage to improve features and functionality.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Data Deletion</h2>
                <p className="text-muted-foreground">
                    You have the right to request the deletion of your personal data at any time. You can request deletion by contacting us at the email address provided below. We will process your request within 30 days.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at: <a href="mailto:finalset.help@gmail.com" className="text-primary hover:underline">finalset.help@gmail.com</a>
                </p>
            </section>
        </div>
    );
}
