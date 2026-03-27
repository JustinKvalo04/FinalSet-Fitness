import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-6 sm:px-12 md:px-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                    By accessing or using our application, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                    We provide a fitness and nutrition tracking tool that uses algorithms to automatically adjust macro targets based on your inputs. The service is provided "as is" and is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Subscriptions and Payments</h2>
                <p className="text-muted-foreground">
                    Certain features of the app require a premium subscription. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage and cancel your subscriptions through your Apple ID account settings or Stripe customer portal, depending on where the purchase was made.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
                <p className="text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
                <p className="text-muted-foreground">
                    If you have any questions about these Terms, please contact us at: <a href="mailto:finalset.help@gmail.com" className="text-primary hover:underline">finalset.help@gmail.com</a>
                </p>
            </section>
        </div>
    );
}
