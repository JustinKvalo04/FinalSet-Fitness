'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [showAuthSuccess, setShowAuthSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      setShowAuthSuccess(true);
    }
  }, []);

  if (showAuthSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto z-10 relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-2xl mb-4">
            <span className="text-emerald-500 text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            You're all set.
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Your email has been confirmed. You can now return to FinalSet Fitness.
          </p>
          <div className="pt-8 w-full">
            <a
              href="finalset://"
              className="flex w-full items-center justify-center px-8 py-4 bg-emerald-500 text-zinc-950 font-black text-lg rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Open FinalSet Fitness
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-zinc-950">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-white">FinalSet</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#premium" className="text-zinc-400 hover:text-white transition-colors">Premium</a>
          </nav>
          <a href="#download" className="bg-white text-zinc-950 px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
            Get Started
          </a>
        </div>
      </header>

      <main>
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              The Ultimate Training Tracker
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
              Track your training.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Build muscle.
              </span><br />
              See real progress.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-medium mb-10 max-w-2xl mx-auto">
              FinalSet Fitness is engineered for serious lifters. Log your sets, track your macros, and unlock premium analytics to push past your plateaus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#download" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-zinc-950 rounded-xl font-black text-lg hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Download Now
              </a>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold text-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                View Features
              </a>
            </div>
          </div>
        </section>

        {/* 2. App Preview Section */}
        <section className="py-20 px-6" id="preview">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] border border-zinc-800 bg-zinc-900 p-2 md:p-4 shadow-2xl overflow-hidden shadow-emerald-900/10">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-transparent pointer-events-none" />
              <div className="aspect-[16/9] bg-zinc-950 rounded-[2rem] flex items-center justify-center border border-zinc-800/50">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                    <span className="text-zinc-500 font-bold text-sm uppercase">App Preview</span>
                  </div>
                  <p className="text-zinc-400">High-fidelity App Visuals Coming Soon.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Features Section */}
        <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/50" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Engineered for Performance.</h2>
              <p className="text-zinc-400 text-lg">Everything you need to log, manage, and scale your training.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Workout Logging', desc: 'Fast, frictionless input systems tracking weight, reps, and RPE seamlessly.', icon: '⚡' },
                { title: 'Macro Tracking', desc: 'Integrated daily nutritional tracking aligning your diet strictly with your goals.', icon: '🎯' },
                { title: 'Progress Insights', desc: 'Dynamic performance derivations mapping exactly where your strengths lie.', icon: '📈' }
              ].map((f, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm border border-zinc-800">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Premium Value Section */}
        <section className="py-24 px-6 bg-zinc-900" id="premium">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                FinalSet Premium
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Unlock absolute control.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Take your tracking bounds to the absolute limit. FinalSet Premium injects complete structural freedom into your routines.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  'Advanced Routine Customization',
                  'Unlimited Custom Exercises',
                  'Deep Progression Analytics',
                  'Exclusive Cloud Backups'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full relative">
              <div className="aspect-square w-full max-w-md mx-auto bg-zinc-950 rounded-full border-8 border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5" />
                <div className="text-center p-8 z-10">
                  <span className="text-6xl mb-4 block">🏆</span>
                  <h3 className="text-white font-bold text-2xl tracking-tighter">Premium Tier</h3>
                  <p className="text-zinc-500 text-sm mt-2">Elevate Your Training.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden" id="download">
          <div className="absolute inset-0 bg-emerald-950/20" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Ready to start your first set?
            </h2>
            <p className="text-zinc-400 text-xl mb-10">
              Join FinalSet Fitness today. Free on the App Store and Google Play.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-white text-zinc-950 rounded-xl font-black text-lg border-2 border-transparent hover:bg-zinc-200 transition-colors w-full sm:w-auto opacity-70 cursor-not-allowed">
                App Store <span className="text-sm font-medium ml-1 bg-zinc-200 px-2 rounded-md">Soon</span>
              </button>
              <button className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-black text-lg border-2 border-zinc-800 w-full sm:w-auto opacity-70 cursor-not-allowed">
                Google Play <span className="text-sm font-medium ml-1 bg-zinc-800 text-zinc-400 px-2 rounded-md">Soon</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="py-12 px-6 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center font-black text-zinc-950 text-xs">
              F
            </div>
            <span className="font-bold text-lg tracking-tight text-white">FinalSet</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:finalset.help@gmail.com" className="text-zinc-500 hover:text-emerald-500 transition-colors">Support: finalset.help@gmail.com</a>
          </div>

          <div className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} FinalSet Fitness. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
