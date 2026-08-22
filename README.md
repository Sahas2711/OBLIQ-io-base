# OBLIQ — AI Compliance Orchestration for Indian CA Firms

> Run compliance operations instead of chasing them.

OBLIQ is an AI-driven compliance orchestration platform built for Indian Chartered Accountant firms. It replaces scattered WhatsApp threads, Excel trackers, and missed deadlines with a single system of record for compliance operations.

## Product Overview

### Who It's For
- CA firm partners who need visibility across all client compliance
- Compliance managers who track deadlines and document collection
- Junior CAs and articled clerks who execute filings daily

### What It Solves
- Missed compliance deadlines (GST, ITR, TDS, ROC)
- Chasing clients for documents over WhatsApp/email
- No single source of truth for compliance work
- Repetitive manual workflows that don't scale
- Zero real-time visibility into pending work

### Core Modules
- **Dashboard** — KPIs, compliance calendar, AI recommendations, activity feed
- **Clients** — Client portfolio with compliance health tracking
- **Tasks** — Compliance task management with filters, priorities, and deadlines
- **Documents** — Document collection, upload, and status tracking
- **AI Assistant** — Context-aware compliance operations assistant

## Architecture

```
obliq-io/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Landing page, auth routes
│   │   ├── (app)/              # Protected application routes
│   │   ├── api/                # API routes (server-side)
│   │   └── auth/               # Auth callbacks
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # App shell, sidebar, topbar
│   │   ├── landing/            # Landing page sections
│   │   ├── auth/               # Auth form components
│   │   └── ai/                 # AI assistant panel
│   ├── lib/
│   │   ├── supabase/           # Supabase client utilities
│   │   ├── ai/                 # AI service abstraction
│   │   ├── data/               # Types and mock data
│   │   ├── hooks/              # React hooks
│   │   └── validations/        # Zod schemas
│   └── middleware.ts           # Route protection
├── supabase/
│   └── schema.sql              # Database schema with RLS
└── public/                     # Static assets
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Custom (Radix-inspired) |
| Auth | Supabase Auth (Credentials provider) |
| Database | PostgreSQL via Supabase |
| Validation | Zod |
| Icons | Lucide React |
| Animations | Framer Motion |
| AI Providers | OpenAI / Gemini / Groq (swappable) |

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-org/obliq-io.git
cd obliq-io
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

1. Go to your Supabase dashboard → SQL Editor
2. Paste the contents of `supabase/schema.sql`
3. Run the query

This creates all tables with Row Level Security policies.

### 4. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Authentication Architecture

- **Provider**: Supabase Auth with Credentials (email + password)
- **Session**: JWT-based via HTTP-only cookies
- **Middleware**: Route protection in `src/middleware.ts`
- **RLS**: Every database query scoped to the authenticated user's firm

### Flow
1. User signs up → Supabase creates auth user + profile record
2. User logs in → Supabase returns JWT → stored in cookies
3. Every request → middleware refreshes session → verifies user
4. Protected routes → redirect to `/login` if unauthenticated
5. Auth routes → redirect to `/app/dashboard` if authenticated

## AI Architecture

### Provider Abstraction
The AI layer supports three providers, swappable via environment variable:

```env
AI_PROVIDER=openai  # or: gemini, groq
```

### How It Works
1. User sends message via AI Assistant panel
2. Request hits `/api/ai/chat` (server-side only)
3. API route loads relevant context (client data, tasks, deadlines)
4. System prompt is built with CA-specific knowledge
5. Response streams back via Server-Sent Events
6. API keys never leave the server

### CA-Specific Capabilities
- Compliance deadline analysis and risk scoring
- Document completion tracking
- Client follow-up message drafting
- GST/TDS/ITR/ROC filing guidance
- Penalty provision explanations

## Database Schema

### Tables
- `firms` — Multi-tenant firm boundary
- `profiles` — User profiles linked to auth.users
- `clients` — Client entities with compliance types
- `compliance_tasks` — Tasks with status, priority, deadlines
- `documents` — Document tracking with status lifecycle
- `activities` — Audit trail
- `task_notes` / `client_notes` — Notes with user attribution

### Security
- Row Level Security (RLS) on all tables
- Every query filtered by `firm_id` from authenticated user's profile
- No client-provided user IDs trusted
- API routes verify session on every request

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js

### 3. Configure environment variables

In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### 4. Deploy

Vercel automatically builds and deploys on every push to `main`.

### 5. Custom domain

1. Vercel dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Known Limitations

1. **Demo data**: Uses mock data for demonstration. Real Supabase connection required for production use.
2. **File storage**: Document upload UI is implemented but actual file storage requires Supabase Storage configuration.
3. **Email/WhatsApp**: Reminder notifications are simulated. Real integration requires Twilio/SendGrid setup.
4. **AI responses**: Require configured API key. Falls back to capability overview without one.
5. **Single firm**: Multi-firm support is architecturally ready but UI is single-firm focused.

## Future Roadmap

- [ ] Real file storage with Supabase Storage
- [ ] Email notification integration (SendGrid/Resend)
- [ ] WhatsApp Business API for client reminders
- [ ] Indian compliance calendar auto-sync
- [ ] PDF generation for filings
- [ ] Client portal for document upload
- [ ] Team management and role-based permissions
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

## License

Proprietary — OBLIQ-io. All rights reserved.
