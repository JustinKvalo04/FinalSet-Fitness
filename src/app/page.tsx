'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Dumbbell, 
  Apple, 
  Scale, 
  Target, 
  LineChart, 
  Crown,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const appStoreLink = "https://apps.apple.com/us/app/finalset-fitness/id6760131492";

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30 selection:text-blue-200 font-sans overflow-x-hidden">
      <NavBar />

      <main className="pt-20">
        {/* 1. HERO SECTION */}
        <section className="relative pt-16 pb-16 px-6 lg:pt-24 lg:pb-24 overflow-hidden flex flex-col items-center">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live on the App Store
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-6">
                The absolute standard <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">for serious lifters.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                Log workouts with zero friction, track your macros perfectly, and measure real progress. 
                Built by a lifter, for lifters.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1">
                Download on the App Store
              </a>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all border border-zinc-800">
                Explore Features
              </a>
            </FadeIn>

            {/* Hero Dashboard Screenshot */}
            <FadeIn delay={0.4} direction="up" duration={0.8}>
              <div className="relative max-w-[280px] md:max-w-md mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-purple-600/30 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700" />
                <Image
                  src="/screenshots/dashboard.png"
                  alt="FinalSet Dashboard"
                  width={600}
                  height={1200}
                  className="relative rounded-[2.5rem] border-[6px] md:border-[8px] border-zinc-900 shadow-2xl object-cover transform transition-transform duration-700 group-hover:-translate-y-2"
                  priority
                  unoptimized
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 2. PRODUCT METRICS */}
        <section className="py-12 px-6 border-y border-zinc-900 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x divide-zinc-900/0 md:divide-zinc-900">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl md:text-4xl font-black text-white">4.9</div>
                  <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wider">App Store Rating</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl md:text-4xl font-black text-white">100%</div>
                  <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wider">Cloud Sync</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl md:text-4xl font-black text-white">Zero</div>
                  <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wider">Fluff or Bloat</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl md:text-4xl font-black text-white">10k+</div>
                  <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wider">Workouts Logged</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything you need. <br className="hidden md:block"/><span className="text-zinc-500">Nothing you don't.</span></h2>
                <p className="text-base md:text-lg text-zinc-400">A tightly integrated ecosystem of tools designed to optimize your training and nutrition.</p>
              </div>
            </FadeIn>

            {/* Feature 1: Workout Tracking */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <FadeIn direction="left">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500">
                    <Dumbbell size={24} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mt-6 mb-4">Workout Tracking</h3>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                    Log every set with zero friction. Whether you're running a Push/Pull/Legs split or an Upper/Lower routine, the app adapts to you. Rapidly input weights and reps while the rest timer keeps you accountable.
                  </p>
                </FadeIn>
              </div>
              <div className="flex-1 w-full flex justify-center md:justify-end">
                <FadeIn direction="right">
                  <div className="relative max-w-[260px] md:max-w-[300px]">
                    <div className="absolute -inset-10 bg-blue-500/20 blur-3xl rounded-full" />
                    <Image src="/screenshots/workout-logging.png" alt="Workout Logging" width={320} height={650} className="relative rounded-[2rem] border-[4px] border-zinc-900 shadow-2xl" unoptimized />
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Feature 2: Macro Tracking */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <FadeIn direction="right">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                    <Apple size={24} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mt-6 mb-4">Macro Tracking</h3>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                    Training is only half the equation. Track your calories, protein, carbs, and fats natively. Keep your nutrition completely aligned with your physique goals without needing a separate subscription.
                  </p>
                </FadeIn>
              </div>
              <div className="flex-1 w-full flex justify-center md:justify-start">
                <FadeIn direction="left">
                  <div className="relative max-w-[260px] md:max-w-[300px]">
                    <div className="absolute -inset-10 bg-emerald-500/20 blur-3xl rounded-full" />
                    <Image src="/screenshots/macros.png" alt="Macro Tracking" width={320} height={650} className="relative rounded-[2rem] border-[4px] border-zinc-900 shadow-2xl" unoptimized />
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Feature Grid for remaining features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
              <FadeIn delay={0.1} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 hover:bg-zinc-900 transition-colors">
                <Scale className="text-amber-500 mb-4" size={28} />
                <h4 className="text-lg md:text-xl font-bold mb-2">Weight Tracking</h4>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed">Monitor your bodyweight trends with smooth charting. See the long-term trajectory of your bulk or cut.</p>
              </FadeIn>
              <FadeIn delay={0.2} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 hover:bg-zinc-900 transition-colors">
                <Target className="text-purple-500 mb-4" size={28} />
                <h4 className="text-lg md:text-xl font-bold mb-2">Goal Management</h4>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed">Set precise targets for your lifts and macros. The dashboard provides immediate feedback on your daily progress.</p>
              </FadeIn>
              <FadeIn delay={0.3} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 hover:bg-zinc-900 transition-colors">
                <LineChart className="text-rose-500 mb-4" size={28} />
                <h4 className="text-lg md:text-xl font-bold mb-2">Progress Analytics</h4>
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed">Visualize your volume and 1RM progressions. Stop guessing if you're getting stronger.</p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 4. WHY FINALSET SECTION */}
        <section className="py-20 px-6 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Stop Guessing. <br className="hidden md:block"/>Start Progressing.</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg mb-16">
                FinalSet is built to keep you consistent. We've removed the clutter so you can focus entirely on executing your workouts and hitting your nutrition targets.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              {[
                "Track progressive overload accurately",
                "Never forget your previous lifts",
                "Hit your macros every single day",
                "Monitor your bodyweight trends",
                "Stay completely accountable",
                "Keep all your fitness data in one place",
                "Visualize measurable progress",
                "Stay consistent without the friction"
              ].map((benefit, i) => (
                <FadeIn key={i} delay={i * 0.05} direction="up" className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                  <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                  <span className="font-medium text-zinc-200">{benefit}</span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section id="faq" className="py-20 px-6 bg-black border-b border-zinc-900">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">Frequently Asked Questions</h2>
            </FadeIn>
            
            <div className="space-y-4">
              <FAQItem 
                question="Is FinalSet Fitness free to use?" 
                answer="Yes, the core workout tracking features are completely free. We offer a Premium tier that unlocks advanced analytics, unlimited macro tracking, and specialized goal management." 
              />
              <FAQItem 
                question="Can beginners use this app?" 
                answer="Absolutely. While built for serious lifters, the interface is highly intuitive. It's a great tool for beginners who want to start their fitness journey with the right data-driven habits." 
              />
              <FAQItem 
                question="Where is my data stored?" 
                answer="Your data is securely stored in the cloud. It syncs seamlessly across your devices as long as you're logged into your account." 
              />
              <FAQItem 
                question="Is an Android version available?" 
                answer="Currently, FinalSet is exclusive to iOS. An Android version is on the future roadmap as the platform scales." 
              />
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="py-20 px-6 border-t border-zinc-900 relative overflow-hidden bg-zinc-950/30">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn>
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mx-auto mb-6 md:mb-8" />
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Ready to elevate your training?</h2>
              <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Join the community of lifters who have stopped guessing and started measuring.
              </p>
              <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-white text-black rounded-full font-black text-base md:text-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105">
                Get FinalSet on the App Store
              </a>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-zinc-900/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-base md:text-lg">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 md:p-6 pt-0 text-sm md:text-base text-zinc-400 leading-relaxed border-t border-zinc-800/50 mt-2">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
