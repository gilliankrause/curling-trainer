# Curling Trainer

Web app to improve curling slide form, build knowledge (glossary + quiz), track practice sessions, and get personalized recommendations.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
3. Create the database and run migrations: `npx prisma migrate dev`
4. Seed glossary terms, quiz questions, and sample drills: `npx prisma db seed`
5. Start the dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Profile** – Sign up, log in, edit profile (name, year started curling, club, teams). Progress is tracked per user.
- **Video analyzer** – Upload slide videos (MP4, MOV, AVI, WebM). Run analysis to get form scores (balance, slide leg, release, consistency) and feedback. Analysis uses form-scoring logic; you can later send pose keypoints (e.g. from browser MediaPipe) to the analyze API for real pose-based scoring.
- **Recommendations** – Based on low scores from your analyses, the app suggests focus areas, drills, and glossary terms. Shown on the dashboard and on each completed video analysis.
- **Glossary** – Curated curling terms (from Curling Canada–style content) with search and category filter. Random term and term detail pages.
- **Quiz** – Randomized quizzes from the glossary and rules. Optional category (glossary vs rules). Logged-in users’ attempts are saved.
- **Practice sessions** – Log sessions with date, duration, focus areas, and notes.
- **Drills** – Browse and create drills (name, description, focus area, difficulty, steps, optional video link). Seeded drills are used by the recommendations engine.

## Tech

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- NextAuth.js (credentials), Prisma + SQLite
- File storage: local `uploads/` (add S3/Vercel Blob for production)

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Run ESLint
- `npm test` – Run lint + build (use after code changes to verify the app still works)
- `npm run db:seed` – Run seed script
- `npx prisma studio` – Open Prisma Studio to inspect the database
