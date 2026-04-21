# VIDURA

VIDURA is a production-ready MVP for an AI-powered Gmail assistant with OAuth authentication, inbox intelligence, priority scoring, and AI reply generation.

## Tech Stack

- Backend: Node.js + Express
- Frontend: React + Vite
- Data strategy: In-memory stores (designed to be replaceable with DB repositories)

## Project Structure

```text
backend/src/
  config/
  controllers/
  middlewares/
  routes/
  services/
  utils/
frontend/src/
  api/
  components/
  context/
  pages/
  styles/
```

## Core Features

- Google OAuth 2.0 flow via `googleapis`
- Gmail inbox fetching with graceful fallback mock data
- Priority engine using keyword score + sender weight + recency decay
- Manual priority override support
- AI reply generation using OpenAI with tone validation and fallback mode
- RESTful API with centralized error handling
- Dark-mode React UI with Login, Inbox, Priority, and Reply Generator views

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY`

Google redirect URI should match backend callback:
`http://localhost:5000/api/auth/google/callback`

## Install and Run

From repository root:

```bash
npm install
npm run install:all
npm run dev
```

This starts:
- Backend at `http://localhost:5000`
- Frontend at `http://localhost:5173`

## API Endpoints

- `GET /api/health`
- `GET /api/auth/google?userId=<id>`
- `GET /api/auth/google/callback`
- `GET /api/email/inbox` (requires `x-user-id` header)
- `GET /api/email/priority` (requires `x-user-id` header)
- `POST /api/email/priority/override`
- `POST /api/email/reply`

## Production Notes

- Replace in-memory stores in `backend/src/services/tokenStore.js` with DB adapters.
- Add secure encrypted token persistence in production.
- Protect API routes with session/JWT middleware.
- Add observability (structured logs, metrics, and tracing).
