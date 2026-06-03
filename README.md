# VIDURA

**VIDURA** is an AI-assisted email intelligence MVP built on Gmail. It combines **heuristic priority scoring** (feature-engineered signals, not a trained classifier) with **GenAI reply drafting** (OpenAI, with safe template fallback).

Designed as a credible GenAI + data-processing demo: honest about what is rule-based vs. model-generated, runnable without Gmail credentials, and testable end-to-end.

---

## What it does

| Feature | How it works |
|--------|----------------|
| **Inbox view** | Fetches real Gmail via OAuth when connected; otherwise serves **mock emails** so the UI always demos. |
| **Priority scoring** | **Rule-based engine**: keyword weights, sender importance, recency decay, optional user keywords (+50 boost, clamped 0–100), manual overrides. |
| **Reply generator** | **OpenAI chat completion** with tone control (`professional` / `casual` / `friendly`). Falls back to a template if the key is missing or the API fails. |
| **Auth** | Google OAuth 2.0; `userId` persisted in browser `localStorage` so refresh does not lose the session. |

> **Not claimed:** no trained ML model, no labeled dataset, no offline evaluation metrics. Priority is explicit heuristic scoring — suitable to discuss as **feature engineering + ranking logic**, not supervised classification.

---

## Architecture

```text
┌─────────────┐     REST (x-user-id)      ┌──────────────────────────────────┐
│  React UI   │ ──────────────────────────► │  Express API                     │
│  (Vite)     │                             │  /api/auth  /api/email  /api/... │
└─────────────┘                             └───────────┬──────────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        ▼                               ▼                               ▼
                 Google OAuth                    Gmail API (real)              OpenAI API (GenAI)
                 + token store                    or mock fallback              or template fallback
                        │
                        ▼
              Priority engine (heuristics)
              keyword + sender + recency + user boost
```

**Data stores (in-memory, MVP):** OAuth tokens, manual priority overrides, per-user keyword lists. Replace with Redis/DB for production.

---

## Quick start (under 2 minutes)

### 1. Install

```bash
npm install
npm run install:all
```

### 2. Configure environment

Copy the example env file into **`backend/.env`** (the backend reads config from here):

```bash
# Linux / macOS
cp backend/.env.example backend/.env

# Windows
copy backend\.env.example backend\.env
```

Edit `backend/.env`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `GOOGLE_CLIENT_ID` | For real Gmail | Google Cloud OAuth client |
| `GOOGLE_CLIENT_SECRET` | For real Gmail | OAuth secret |
| `GOOGLE_REDIRECT_URI` | For real Gmail | `http://localhost:5000/api/auth/google/callback` |
| `SESSION_SECRET` | Recommended | Session signing (future use) |
| `OPENAI_API_KEY` | Optional | GenAI replies; template fallback if absent/failing |
| `PORT` | Optional | Default `5000` |
| `CLIENT_URL` | Optional | Frontend origin, default `http://localhost:5173` |

### 3. Run

```bash
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173  

### 4. Demo without Google credentials

1. Open http://localhost:5173  
2. Click **Continue in demo mode**  
3. Browse **Inbox** (mock data) and **Priority** (heuristic scores)  
4. Try **Reply Generator** — works with or without OpenAI  

### 5. Demo with real Gmail

1. Create Google Cloud OAuth credentials (Web application)  
2. Set redirect URI to `http://localhost:5000/api/auth/google/callback`  
3. Fill `GOOGLE_*` vars in `backend/.env`  
4. Click **Login with Google**  

---

## Testing

```bash
npm test
```

Covers:

- Priority scoring and user keyword boost (including 100 cap and per-user isolation)  
- AI reply fallback when OpenAI is unavailable or errors  
- API smoke tests (`/api/health`, mock inbox, reply endpoint)  

---

## API reference

| Method | Path | Auth header | Description |
|--------|------|-------------|-------------|
| `GET` | `/api/health` | — | Health check |
| `GET` | `/api/auth/google?userId=` | — | Start OAuth, returns `authUrl` |
| `GET` | `/api/auth/google/callback` | — | OAuth callback (redirects to frontend) |
| `GET` | `/api/email/inbox` | `x-user-id` | Inbox (Gmail or mock) |
| `GET` | `/api/email/priority` | `x-user-id` | Scored + sorted inbox |
| `POST` | `/api/email/priority/override` | — | Manual score override |
| `GET/POST/DELETE` | `/api/emails/priority/keywords` | `x-user-id` | Per-user priority keywords |
| `POST` | `/api/email/reply` | — | GenAI reply (`source`: `openai` or `fallback`) |

---

## Project structure

```text
backend/src/
  config/          env loading (backend/.env)
  controllers/     route handlers
  services/        Gmail, priority engine, OpenAI, OAuth
  routes/          Express routers
  middlewares/     error handling
backend/tests/     unit + smoke tests
frontend/src/
  pages/           Login, Inbox, Priority, Reply Generator
  context/         Auth (localStorage session)
  api/             fetch wrapper
```

---

## Limitations (honest scope)

- **No trained ML model** — priority is transparent heuristic scoring.  
- **In-memory storage** — tokens and overrides reset on server restart.  
- **No production auth middleware** — API trusts `x-user-id` header (MVP only).  
- **OpenAI dependency** — optional; failures degrade gracefully to templates.  
- **Gmail read-only** — no send/draft integration in this MVP.  

---

## Production next steps

- Persist tokens and user data in a database  
- Add JWT/session middleware on protected routes  
- Encrypt OAuth tokens at rest  
- Structured logging, metrics, and tracing  

---

## Tech stack

- **Backend:** Node.js, Express, googleapis, OpenAI SDK  
- **Frontend:** React 18, Vite, React Router  
- **Tests:** Node built-in `node:test` + supertest  
