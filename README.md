# Fitique - Fitness Tracker

Fitique is a full-stack fitness tracking web application that helps users plan workouts, track nutrition and sleep, monitor recovery, and stay motivated through an interactive community feed and an AI-powered fitness assistant.

## Features

- **User Accounts** - Secure email/password registration and login with JWT authentication and CSRF protection.
- **Password Recovery** - Forgot and reset password flow with a verification code.
- **Workout Plans** - Pre-built workout routines (biceps, chest, legs, core) with exercise sets and reps.
- **Workout History** - Log completed workouts and track progress over time.
- **Nutrition Tracker** - Track daily meals, calories, and macronutrients.
- **Sleep & Recovery** - Log sleep duration and quality, with weekly recovery insights.
- **Community Feed** - Photo posts with likes, comments, and user avatars.
- **AI Fitness Assistant** - Built-in chatbot powered by Groq that answers fitness questions.
- **Daily Streaks & Activity** - Track water intake, weekly activity, and workout streaks.
- **Themes** - Dark and light mode.

## Tech Stack

- **Frontend** - React (Vite), Tailwind CSS
- **Backend** - Node.js, Express
- **Database** - MongoDB (Mongoose), with a local JSON fallback store for offline development
- **Auth** - JWT, bcrypt
- **AI** - Groq SDK
- **Deployment** - Netlify (frontend), Vercel-ready (backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/susmitakunwar188-cpu/FitnessTracker.git
   cd FitnessTracker
   ```

2. Install dependencies:

   ```bash
   npm install
   cd backend && npm install
   ```

3. Create the environment files:

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

   Fill in `MONGODB_URI`, `JWT_SECRET`, and `GROQ_API_KEY` in `backend/.env`.

4. Start the development servers (frontend + backend together):

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Script         | Description                                   |
| -------------- | --------------------------------------------- |
| `npm run dev`  | Starts the Vite dev server and Express backend |
| `npm run build`| Builds the frontend for production            |
| `npm run lint` | Runs ESLint                                   |
| `npm run backend` | Starts only the Express backend             |

## Project Structure

```
├── backend/          # Express API, routes, models, database layer
├── public/           # Static assets
├── src/
│   ├── components/   # React UI components
│   └── utils/        # API client and helper utilities
├── .env.example      # Frontend environment variables template
└── vite.config.js    # Vite configuration
```

## Deployment

- **Frontend**: Deploy to Netlify (or any static host). Set `VITE_API_URL` to your deployed backend URL.
- **Backend**: Deploy to Vercel (or any Node host). Set `MONGODB_URI`, `JWT_SECRET`, and `GROQ_API_KEY`.

## Future Enhancements

- **Social Login** - Re-introduce Google OAuth for one-click sign-in.
- **Email Verification** - Verify user email addresses on registration.
- **Email Notifications** - Send password-reset links and workout reminders by email.
- **Workout Media** - Add exercise demo videos and images to workout plans.
- **Progress Analytics** - Charts for BMI, weight, and fitness milestones over time.
- **Real-Time Community** - Live notifications for likes, comments, and new posts.
- **Data Export** - Allow users to download their data as JSON/CSV.
- **Progressive Web App (PWA)** - Offline support and installable mobile experience.
- **Tests & CI/CD** - Add automated unit/integration tests and a CI pipeline.
- **Rate Limiting** - Protect authentication and chat endpoints from abuse.
