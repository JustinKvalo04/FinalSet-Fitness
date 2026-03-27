"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, TrendingDown, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden">
      {/* Navbar (Placeholder) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Activity className="h-6 w-6 text-primary" />
          <span>Macro<span className="text-primary text-xl">Track</span></span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-base">
            Log In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:scale-105 transition-base shadow-lg">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative px-6 mt-16 md:mt-32">

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full -z-10 pointer-events-none hidden md:block" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Data-Driven Fitness, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Automated for You.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing your macros. Track your weight, log your strength, and let our algorithm automatically adjust your nutrition targets every week for optimal results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-full font-semibold text-lg border border-border bg-background/50 backdrop-blur-sm hover:bg-secondary transition-all duration-300">
              See How It Works
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-6xl z-10"
        >
          {[
            {
              title: "Auto-Adjusting Macros",
              desc: "Based on weekly weight and strength trends, your macros adapt to keep you on target.",
              icon: <Target className="w-8 h-8 text-primary" />
            },
            {
              title: "Strength Logging",
              desc: "Track lifts easily. progressive overload triggers our algorithm to fuel your muscles.",
              icon: <Activity className="w-8 h-8 text-accent" />
            },
            {
              title: "Weight Trend Analysis",
              desc: "Say goodbye to scale anxiety. We smooth out daily fluctuations for accurate tracking.",
              icon: <TrendingDown className="w-8 h-8 text-blue-400" />
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 md:p-8 rounded-3xl bg-secondary/30 border border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-base hover:-translate-y-2">
              <div className="bg-background w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 mt-24 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tighter">
          <Activity className="h-5 w-5 text-primary" />
          <span>Macro<span className="text-primary">Track</span></span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <a href="mailto:finalset.help@gmail.com" className="hover:text-primary transition-colors">
            Support
          </a>
        </div>

        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FinalSet Fitness. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
