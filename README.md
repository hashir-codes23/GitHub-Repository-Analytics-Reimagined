# DevPulse — GitHub Repository Analytics Dashboard

> **GitHub Repository Analytics, Reimagined.**
> DevPulse transforms raw GitHub repository data into meaningful, interactive analytics — health scores, language insights, contributor rankings, activity timelines and head-to-head repository comparisons.

**Student:** Muhammad Hashir
**Registered Email:** hashirbaloch635@gmail.com
**Project:** Advanced Web Development Internship

---

## Screenshots

| Landing Page | Analytics Dashboard |
|--------------|---------------------|
| *(add screenshot)* | *(add screenshot)* |

| Comparison | Favorites |
|------------|-----------|
| *(add screenshot)* | *(add screenshot)* |

---

## Features

- **Repository Search** — accepts `owner/repo`, full GitHub URLs and `.git` URLs, with validation and friendly animated errors.
- **Analytics Dashboard** — stars, forks, watchers, open issues, PRs, contributors, primary language, size, license, default branch, topics, created/updated dates — all live from the GitHub REST API.
- **DevPulse Health Score** — a custom 0–100 score (not an official GitHub metric) with an animated circular indicator and a six-factor breakdown.
- **Data Visualization** — language donut chart, 26-week commit activity area chart, top-contributors bar chart, comparison radar chart (Recharts).
- **Repository Comparison** — two repos head-to-head with winner badges, dual progress bars, radar chart and an overall verdict.
- **Recent Activity Timeline** — commits, pull requests, issues and releases merged into one animated timeline.
- **Authentication** — email/password registration & login with bcrypt hashing and JWT sessions; analytics, comparison and favorites routes are protected on both client and server.
- **Favorites & Recent Searches** — stored in `localStorage`, with add/remove/clear and smooth animations.
- **Yellow & White Design System** — a centralized Tailwind theme with soft golden accents, glass surfaces, glow shadows and a canvas of small particles flowing from bottom to top across the whole app.
- **Animations** — Framer Motion page transitions, staggered cards, animated counters, chart entrances, animated nav indicator, modal/toast transitions, reduced-motion support.
- **Dark / Light Mode** — default is the signature yellow & white light theme; an optional warm dark theme keeps the yellow branding.
- **Loading & Error States** — shimmer skeletons, spinner, friendly error screens with retry, rate-limit and network-error handling.
- **Fully Responsive** — dedicated mobile layouts, hamburger navigation, responsive charts, touch-friendly controls.

## Technology Stack

**Frontend:** React 18 · Vite · Tailwind CSS · React Router · Framer Motion · Recharts · Lucide React · Axios
**Backend:** Node.js · Express · JWT (jsonwebtoken) · bcryptjs · express-rate-limit
**External API:** GitHub REST API (official, no scraping)

## Architecture

```
devpulse/
├── client/                     # React + Vite frontend
│   ├── public/favicon.svg
│   ├── index.html
│   ├── vite.config.js          # dev proxy: /api -> localhost:5000
│   ├── tailwind.config.js      # centralized yellow & white design system
│   └── src/
│       ├── components/
│       │   ├── ui/             # Loaders, States (error/empty), Modal, CountUp, Logo
│       │   ├── layout/         # Navbar, Footer
│       │   ├── dashboard/      # MetricCard, HealthScore, RepoHeader, ActivityTimeline
│       │   ├── charts/         # LanguageChart, ActivityChart, ContributorsChart, CompareRadar
│       │   ├── ParticleBackground.jsx   # bottom-to-top canvas particles
│       │   ├── SearchBar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/              # Home, Analytics, Compare, Favorites, Login, Register, About, NotFound
│       ├── hooks/              # useFavorites, useRecent (localStorage)
│       ├── context/            # AuthContext, ThemeContext, ToastContext
│       ├── services/api.js     # axios instance + JWT interceptor + friendly errors
│       ├── utils/format.js     # input parsing, number/date formatting, palettes
│       ├── App.jsx             # routes + lazy loading
│       └── main.jsx
├── server/                     # Express API
│   ├── server.js               # app entry, CORS, rate limiting, routes
│   ├── routes/                 # /api/auth, /api/github
│   ├── controllers/            # authController, githubController
│   ├── services/
│   │   ├── githubService.js    # GitHub fetch layer + 5-min TTL cache + error mapping
│   │   └── userStore.js        # JSON-file user store (swap for a real DB later)
│   ├── middleware/             # requireAuth (JWT), errorHandler, ApiError
│   ├── utils/                  # cache, healthScore algorithm
│   └── data/                   # users.json is created here at runtime
├── .env.example
└── package.json                # root scripts (dev, build, start)
```

**Request flow:** React → Axios (`/api/...` with JWT header) → Vite proxy → Express (`requireAuth`) → GitHub service (cache → GitHub REST API) → shaped JSON → animated dashboard.

## Installation

Requires **Node.js 18+**.

```bash
# 1. Unzip and enter the project
cd devpulse

# 2. Install all dependencies (root + server + client)
npm install          # root (concurrently)
npm run install-all  # server + client
```

## Environment Variables

Copy `.env.example` to **`server/.env`** (the Express server reads `.env` from the `server/` directory):

```env
PORT=5000
JWT_SECRET=change-this-to-a-long-random-string
GITHUB_TOKEN=
```

- **`PORT`** — port for the Express API (default `5000`). The Vite dev server proxies `/api` here.
- **`JWT_SECRET`** — signs authentication tokens. Required in production; a dev fallback exists for local testing.
- **`GITHUB_TOKEN`** — *optional*. Without it the app uses unauthenticated GitHub API access (60 requests/hour). With a token you get 5,000 requests/hour. Create one at <https://github.com/settings/tokens> — no scopes are needed for public repositories. **Never commit this file.**

## Development Commands

```bash
# Run server (port 5000) + client (port 5173) together
npm run dev

# Or run them separately
npm run dev --prefix server
npm run dev --prefix client
```

Open <http://localhost:5173>, create an account, and analyze a repository (try `facebook/react`).

## Production Build

```bash
npm run build                 # builds the client into client/dist
npm start                     # starts the Express server
```

## Deployment

- **Client** (Vercel / Netlify): build command `npm run build`, output `client/dist`. Point `/api` at the hosted server (set the Axios `baseURL` in `client/src/services/api.js` to your server URL).
- **Server** (Render / Railway): start command `node server/server.js` (or `npm start --prefix server`), set `JWT_SECRET` and optionally `GITHUB_TOKEN` as environment variables, and enable CORS for your client domain.

## Health Score Methodology

The **DevPulse Health Score** (0–100) is a custom heuristic and is clearly labeled as such in the UI. It is *not* an official GitHub metric.

| Factor | Points | Signals |
|---|---|---|
| Recent Activity | 25 | Days since last push (≤7 days = full marks, decays over a year) |
| Popularity | 20 | Stars (12) + forks (8), log-scaled |
| Community | 15 | Contributor count (10) + watchers/subscribers (5) |
| Maintenance | 20 | Open-issue pressure relative to stars (12) + recent PR flow (8) |
| Documentation | 10 | Description (4) + license (3) + topics (3) |
| Maturity | 10 | Repository age, saturating at ~3 years |

Categories: **Excellent** ≥ 80 · **Good** ≥ 60 · **Fair** ≥ 40 · **Needs Attention** < 40.

## GitHub API Integration

- The client never calls GitHub directly. The Express server proxies and shapes these endpoints:
  - `GET /repos/{owner}/{repo}` — metadata
  - `GET /repos/{owner}/{repo}/languages` — language bytes
  - `GET /repos/{owner}/{repo}/contributors` — top contributors
  - `GET /repos/{owner}/{repo}/commits` — recent commits (also aggregated into 26 weekly buckets for the activity chart)
  - `GET /repos/{owner}/{repo}/pulls`, `/issues`, `/releases` — activity timeline
- Responses are cached in memory for 5 minutes (TTL) to avoid duplicate requests and stay under rate limits.
- Errors are mapped to friendly messages: 404 → "Repository not found", 403/429 → rate-limit guidance, network failure → connection message.
- Secondary endpoints fail *tolerantly* so one empty endpoint (e.g. no releases) never breaks the whole dashboard.

## Authentication

- **Register / Login** with email + password (`POST /api/auth/register`, `POST /api/auth/login`).
- Passwords are hashed with **bcrypt** (cost 10); only hashes are stored.
- The server returns a **JWT** (7-day expiry). The client stores it in `localStorage` and an Axios interceptor attaches it as `Authorization: Bearer <token>` to every request.
- `GET /api/github/*` endpoints are protected by the `requireAuth` middleware; client routes (`/analytics`, `/compare`, `/favorites`) are guarded by `ProtectedRoute`, which remembers the intended destination and returns there after login.
- A 401 response clears the session and redirects to `/login`.

## 3-Day Development Summary

- **Day 1** — Project scaffolding (Vite + Tailwind + Express), GitHub API integration through the server proxy, repository search with validation, routing, JWT authentication, basic analytics.
- **Day 2** — Full analytics dashboard, Recharts visualizations, health-score algorithm, comparison page, favorites + recent searches, responsive layouts.
- **Day 3** — Yellow & white design system, particle background, animations, dark/light theme, skeleton loading states, error handling, caching + rate-limit management, mobile testing, README, deployment prep.

## Possible Viva Questions & Answers

1. **Why proxy GitHub through your own server?** — Centralized caching (fewer API calls), friendly error mapping, token security (the GitHub token never ships to the browser) and a single place for rate-limit handling.
2. **How does authentication work?** — bcrypt-hashed passwords, JWT signed on login, Axios interceptor attaches the token, Express middleware verifies it, React `ProtectedRoute` guards pages.
3. **Why JWT instead of sessions?** — Stateless: no server-side session store needed, scales horizontally, and the client can run on a different origin.
4. **How is the health score calculated?** — Six weighted factors (activity, popularity, community, maintenance, documentation, maturity) totaling 100; see the methodology table above.
5. **How do you handle GitHub rate limits?** — 5-minute in-memory TTL cache, bundled requests (one analyze call instead of seven), optional `GITHUB_TOKEN`, and a friendly 429 message with recovery advice.
6. **Why `localStorage` for favorites?** — The prompt explicitly avoids CRUD-for-its-own-sake; favorites are personal, per-device data, so server persistence adds no value here.
7. **How is the UI kept consistent?** — A centralized Tailwind theme (`tailwind.config.js`) defines the yellow & white palette, shadows and animations; components never hard-code random colors.
8. **What performance optimizations are used?** — Route-level code splitting (`React.lazy`), server-side caching, request cancellation on unmount, memoized timeline data, debounce-friendly search design.
9. **How are errors handled?** — A server `ApiError` class + error middleware produce clean JSON errors; the client converts them to friendly messages and shows retry-capable error states.
10. **How is accessibility supported?** — Semantic HTML, labels on all inputs, ARIA on icon buttons, keyboard-focus rings, sufficient contrast, and `prefers-reduced-motion` support (the particle canvas respects it).
11. **What would you improve next?** — A real database (Postgres), refresh tokens, GitHub OAuth login, commit-activity via `/stats/commit_activity` with 202-retry, and server-side rendering for SEO.
12. **Is the health score an official GitHub metric?** — No. It is a custom DevPulse heuristic, clearly labeled as such in the UI and documentation.

## Future Improvements

- GitHub OAuth sign-in alongside email/password
- Persistent per-user favorites in a real database
- Commit-activity heatmap using `/stats/commit_activity`
- Repository history tracking (star growth over time)
- PDF/PNG export of the analytics report
- Docker Compose for one-command startup

---

*DevPulse uses the official GitHub REST API. All repository data belongs to its respective owners.*
