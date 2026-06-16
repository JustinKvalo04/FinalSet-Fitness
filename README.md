# FinalSet Fitness

FinalSet Fitness is a bodybuilding-focused fitness application designed for serious lifters who want to track workouts, nutrition, body weight, goals, and long-term progress in one place.

The project includes both a web platform and native mobile app experience, with user authentication, database-backed tracking features, and premium subscription functionality.

## Overview

Most fitness apps are built for general fitness users. FinalSet Fitness is designed specifically for lifters focused on hypertrophy, consistency, and measurable progress.

Core features include:

* Workout tracking
* Exercise logging
* Macro tracking
* Weight logging
* Goal tracking
* Progress monitoring
* Premium subscription features
* User authentication
* Database-backed user data

## Tech Stack

**Frontend / Web**

* Next.js
* TypeScript
* React
* Tailwind CSS

**Mobile**

* React Native
* Expo
* Expo Router

**Backend / Database**

* Supabase
* PostgreSQL
* Row Level Security

**Payments / Subscriptions**

* RevenueCat
* Apple In-App Purchases

**Deployment**

* Vercel
* EAS Build
* Apple App Store Connect

## My Role

I designed and developed FinalSet Fitness from concept to App Store submission.

My responsibilities included:

* Product strategy
* UX design
* Database architecture
* Authentication setup
* Workout tracking logic
* Macro and weight tracking systems
* Premium feature planning
* Mobile app development
* Web landing page development
* App Store submission preparation

## Key Features

### Workout Tracking

Users can log workouts, track exercises, record sets and reps, and monitor training consistency over time.

### Macro Tracking

Users can set nutrition targets and log daily intake to support muscle gain, fat loss, or maintenance goals.

### Weight Tracking

Users can record body weight and monitor trends toward their target weight.

### Goal Management

Users can define physique and performance goals and track progress inside the app.

### Premium Features

The app includes premium subscription functionality for advanced workout customization and future premium tools.

## Project Structure

```text
FinalSet-Fitness/
├── app-native/       # React Native / Expo mobile app
├── src/              # Next.js web application
├── supabase/         # Database and Supabase-related files
├── public/           # Static assets
├── app.json          # Expo app configuration
├── eas.json          # EAS build configuration
└── package.json      # Project dependencies and scripts
```

## Development Setup

Clone the repository:

```bash
git clone https://github.com/JustinKvalo04/FinalSet-Fitness.git
cd FinalSet-Fitness
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add the required environment variables for Supabase, payments, and deployment services.

Run the web app locally:

```bash
npm run dev
```

## Status

FinalSet Fitness has been prepared for App Store submission and production deployment.

## What I Learned

This project strengthened my experience in:

* Building full-stack applications
* Designing database schemas
* Managing user authentication
* Developing mobile apps with React Native and Expo
* Connecting product strategy with technical implementation
* Preparing a real application for production release

## Author

Justin Kvalo
Information Science Student, University of Wisconsin–Madison
Email: [justinkvalo@gmail.com](mailto:justinkvalo@gmail.com)
