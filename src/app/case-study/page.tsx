'use client';

import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <NavBar />
      
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <FadeIn>
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">FinalSet Fitness: <br className="hidden md:block"/> Engineering a Modern Tracker</h1>
            <p className="text-xl text-zinc-400">A deep dive into the product architecture, design decisions, and development process of a production-level iOS application.</p>
          </div>
        </FadeIn>

        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300">
          
          <FadeIn delay={0.1}>
            <h2>The Problem</h2>
            <p>
              Most fitness applications on the market suffer from one of two problems: they are either incredibly bloated with unnecessary social features and generic routines, or they lack the robust data-tracking capabilities required by serious lifters. I wanted an application that removed friction from logging sets while providing enterprise-grade analytics on volume and macro-nutrients.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>My Role</h2>
            <p>
              As the sole creator of FinalSet Fitness, I was responsible for the entire product lifecycle. This included acting as the Product Manager to define the MVP, the UI/UX Designer to craft the interface in Figma, the Database Architect to design the schema in PostgreSQL, and the Lead Engineer to build, test, and deploy the application using React Native.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>Product Planning & UI/UX</h2>
            <p>
              The design philosophy centered around "zero-friction during the workout." I mapped out user flows that minimized taps between completing a set and logging it. The interface utilizes a deep dark mode aesthetic, specifically designed to be easy on the eyes in dimly lit gym environments, while using vibrant accent colors to denote success states and rest timers.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>Database Architecture</h2>
            <p>
              The backend is powered by PostgreSQL via Supabase. The relational model is designed to handle complex queries efficiently. Key architectural decisions included:
            </p>
            <ul>
              <li><strong>Normalized Schemas:</strong> Separating Workout templates from logged Workout sessions to allow users to modify historical data without affecting future routines.</li>
              <li><strong>Row Level Security (RLS):</strong> Ensuring that users can only query and mutate their own fitness data, providing robust privacy at the database layer.</li>
              <li><strong>Real-time Sync:</strong> Utilizing Supabase's real-time capabilities to ensure data is synced instantly across devices.</li>
            </ul>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>Tech Stack</h2>
            <p>
              The application leverages a modern, scalable technology stack:
            </p>
            <ul>
              <li><strong>Frontend:</strong> React Native with Expo for cross-platform potential, written in strict TypeScript.</li>
              <li><strong>Backend:</strong> Supabase (PostgreSQL, Auth, Storage).</li>
              <li><strong>Monetization:</strong> RevenueCat for robust subscription management.</li>
              <li><strong>State Management:</strong> Context API and optimized local state for immediate UI feedback.</li>
              <li><strong>Design:</strong> Tailwind CSS (NativeWind) for styling and Figma for prototyping.</li>
            </ul>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>Development Process & Challenges</h2>
            <p>
              Adopting an Agile approach, I built FinalSet in two-week sprints. One of the most significant technical challenges was handling offline support. Gyms often have poor cellular reception. I implemented a local caching strategy that allows users to log their entire workout offline, queueing the mutations to sync with Supabase once connectivity is restored.
            </p>
            <p>
              Another challenge was integrating RevenueCat for Apple subscriptions. Handling webhooks for subscription renewals, cancellations, and trial conversions required careful synchronization between RevenueCat's servers and my PostgreSQL database to ensure user access was always accurate.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2>Key Lessons Learned</h2>
            <p>
              Building FinalSet taught me that software engineering is as much about managing scope as it is about writing code. It reinforced the importance of writing clean, maintainable TypeScript, as technical debt compounds rapidly in solo projects. Most importantly, it proved that a well-designed data layer is the foundation of any successful application.
            </p>
          </FadeIn>

        </article>
      </main>

      <Footer />
    </div>
  );
}
