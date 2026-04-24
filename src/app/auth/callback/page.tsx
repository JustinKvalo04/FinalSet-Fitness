'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function CallbackContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your securely bounded authentication payload...');

    useEffect(() => {
        const verify = async () => {
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');
            const errorDesc = searchParams.get('error_description');

            if (errorParam) {
                setStatus('error');
                setMessage(errorDesc || 'Link expired or invalid payload detected natively.');
                return;
            }

            if (code) {
                const supabase = createClient();
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    setStatus('error');
                    setMessage(error.message || 'Failed to exchange payload. Try requesting a new link.');
                } else {
                    setStatus('success');
                    setMessage('Email confirmed successfully. You can return to your app pipeline.');
                }
            } else {
                // If it's a legacy hash payload, Supabase client un-hashes it automatically on load.
                const supabase = createClient();
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    setStatus('success');
                    setMessage('Email completely mapped. You can return to the app.');
                } else {
                    // Check if hash is in URL for implicit fallback
                    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
                        setStatus('success');
                        setMessage('Email verified natively. Return to your application bounded safely.');
                    } else {
                        setStatus('error');
                        setMessage('No valid payload explicitly located.');
                    }
                }
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto z-10 relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-2xl mb-4">
                {status === 'loading' && (
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent flex items-center justify-center rounded-full animate-spin" />
                )}
                {status === 'success' && (
                    <span className="text-emerald-500 text-3xl">✓</span>
                )}
                {status === 'error' && (
                    <span className="text-rose-500 text-3xl">!</span>
                )}
            </div>

            <h1 className="text-3xl font-black tracking-tighter text-white">
                {status === 'loading' ? 'Confirming...' : status === 'success' ? 'Email Confirmed' : 'Verification Error'}
            </h1>

            <p className="text-zinc-400 text-lg font-medium">
                {message}
            </p>

            {status === 'success' && (
                <div className="pt-8 w-full">
                    <a
                        href="finalset://"
                        className="flex w-full items-center justify-center px-8 py-4 bg-emerald-500 text-zinc-950 font-black text-lg rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        Return to App
                    </a>
                    <p className="mt-4 text-zinc-500 text-sm">
                        If the button doesn't work automatically, you may close this window manually.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />
            <Suspense fallback={<div className="text-emerald-500 animate-pulse">Loading core constraints...</div>}>
                <CallbackContent />
            </Suspense>
        </div>
    );
}
