# Personal Finance Tracker

A mobile-first personal finance tracking web application built with Next.js, Supabase, and Vercel AI SDK.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Vercel AI SDK with OpenAI

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Fill in your environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `OPENAI_API_KEY`: Your OpenAI API key

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Status

### ✅ Epic 1: Project Setup & Configuration - COMPLETE
- Next.js project initialized
- Tailwind CSS configured
- Shadcn UI components installed
- Mobile-first utilities created
- Environment configuration set up

### 📋 Next Steps
- Epic 2: Database Setup & Migrations
- Epic 3: Authentication Setup
- Epic 4: Dashboard Page
- Epic 5: Summary & Analytics Page
- Epic 6: Chatbot Insights Page
- Epic 7: Navigation & Layout

## Project Structure

```
finance-app/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   └── ui/                # Shadcn UI components
├── lib/                    # Utility functions and hooks
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── supabase/              # Supabase migrations (to be created)
│   └── migrations/       # SQL migration files
└── types/                 # TypeScript type definitions
```

## Features (Planned)

- ✅ Project setup and configuration
- 📋 Expense tracking with categories
- 📋 Analytics and spending trends
- 📋 AI-powered expense insights
- 📋 Mobile-first responsive design

