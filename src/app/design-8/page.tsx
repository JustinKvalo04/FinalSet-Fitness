'use client';

import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Zap, Trophy, TrendingUp } from 'lucide-react';

export default function Design8() {
  const appStoreLink = "https://apps.apple.com/us/app/finalset-fitness/id6760131492";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-black text-xl tracking-tighter text-black flex items-center gap-2">
            FinalSet.
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#premium" className="hover:text-black transition-colors">Premium</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
            <a href="/case-study" className="hover:text-black transition-colors">Case Study</a>
          </nav>
          <a href={appStoreLink} className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Download
          </a>
        </div>
      </header>

      <main className="pt-32 pb-12">
        {/* HERO */}
        <section className="px-6 pb-8 text-center max-w-4xl mx-auto flex flex-col items-center">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-[1.05]">
              Everything you need for your physique. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Lives inside one app.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 font-medium mb-10 max-w-2xl mx-auto">
              Progress you can actually measure. Stop guessing. Know exactly what you lifted last time, hit your macros perfectly, and watch your bodyweight trend down.
            </p>
            <div className="flex gap-4 justify-center">
              <a href={appStoreLink} className="px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
                Get the App
              </a>
            </div>
          </FadeIn>
        </section>

        {/* FLOATING APP ECOSYSTEM */}
        <section className="px-6 py-16 w-full relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-zinc-50 to-transparent pointer-events-none" />
          
          <div className="relative w-full max-w-5xl mx-auto flex justify-center items-center h-[500px]">
            {/* Left Screenshot */}
            <FadeIn delay={0.2} className="absolute left-4 md:left-[10%] top-1/2 -translate-y-1/2 z-10 w-[170px] md:w-[220px]">
              <img src="/screenshots/macros.png" alt="Macros" className="w-full rounded-[2rem] border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform -rotate-[6deg] transition-all duration-400 ease-out hover:z-50 hover:scale-[1.15] hover:rotate-0 hover:-translate-y-6 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]" />
            </FadeIn>

            {/* Right Screenshot */}
            <FadeIn delay={0.3} className="absolute right-4 md:right-[10%] top-1/2 -translate-y-1/2 z-10 w-[170px] md:w-[220px]">
              <img src="/screenshots/programs.png" alt="Programs" className="w-full rounded-[2rem] border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform rotate-[6deg] transition-all duration-400 ease-out hover:z-50 hover:scale-[1.15] hover:rotate-0 hover:-translate-y-6 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]" />
            </FadeIn>

            {/* Center Screenshot */}
            <FadeIn delay={0.1} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-[200px] md:w-[270px]">
              <img src="/screenshots/dashboard.png" alt="Dashboard" className="w-full rounded-[2.5rem] border-[8px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-400 ease-out hover:z-50 hover:scale-[1.12] hover:-translate-y-6 hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)]" />
            </FadeIn>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Every workout. Every macro. Every pound.</h2>
              <p className="text-zinc-500 font-medium text-lg">A tightly integrated toolkit engineered for serious progression.</p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-white border border-zinc-200/80 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Workout Tracking</h3>
                <p className="text-zinc-500 font-medium">Log your sets instantly. FinalSet recalls your previous weights and reps so you can beat your past performance without searching through notes.</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-white border border-zinc-200/80 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Nutrition & Macros</h3>
                <p className="text-zinc-500 font-medium">Track calories, protein, carbs, and fats seamlessly. Your nutrition data lives exactly where your training data lives.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white border border-zinc-200/80 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Real Progress</h3>
                <p className="text-zinc-500 font-medium">Monitor your bodyweight trends, visualize your 1-rep max progressions, and know that your effort is paying off.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* PREMIUM */}
        <section id="premium" className="py-20 px-6 bg-white border-y border-zinc-200/60">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <FadeIn>
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md mb-6">FinalSet Pro</div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">For the dedicated lifter.</h2>
                <p className="text-lg text-zinc-500 font-medium mb-8">
                  Unlock limitless history, detailed analytics charting, and unrestricted macro tracking. See the data behind your physique.
                </p>
                <a href={appStoreLink} className="inline-block px-8 py-3 bg-zinc-100 text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                  Upgrade Today
                </a>
              </FadeIn>
            </div>
            <div className="flex-1 w-full flex justify-center">
              <FadeIn direction="left">
                <img src="/screenshots/workout-list.png" alt="History" className="w-[240px] md:w-[280px] rounded-[2rem] border-[6px] border-zinc-100 shadow-xl transition-all duration-400 hover:scale-105 hover:-translate-y-4 hover:shadow-2xl" />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem q="Is FinalSet free?" a="The core workout tracker is free. FinalSet Premium unlocks advanced data analytics and unlimited macro tracking." />
            <FAQItem q="Is my data safe?" a="Yes. All your data is securely stored in the cloud and synced instantly to your account." />
            <FAQItem q="Do you have an Android app?" a="Not yet. FinalSet is currently built exclusively for iOS." />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Your next PR starts with knowing your last one.</h2>
            <a href={appStoreLink} className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-xl transition-all">
              Download on the App Store
            </a>
          </FadeIn>
        </section>

      </main>
      
      <footer className="py-12 bg-white text-center text-zinc-500 font-bold text-sm border-t border-zinc-200">
        <p>FinalSet Fitness © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm">
      <button className="w-full flex justify-between items-center p-6 text-left font-bold text-black hover:bg-zinc-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        {q}
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="px-6 pb-6 text-zinc-500 font-medium">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
