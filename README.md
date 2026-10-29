# FOCUS & FORCE 2.0 — The Ultimate Algerian BAC Operating System
**Study With Purpose** • by Rayane

---

## 🌟 Overview
**FOCUS & FORCE 2.0** is an innovative, high-performance, and deeply personalized personal operating system engineered specifically for Algerian Baccalaureate (BAC) students.

Moving beyond generic study trackers, FOCUS & FORCE unites five interconnected engines into one cohesive academic command center:
1. **MISSION CONTROL:** Dynamic dashboard answering: *What matters most today? What should I do next?*
2. **SMART STUDY ENGINE:** Adaptive mission planning tailored to real available hours, difficulty, and study velocity.
3. **MASTERY ENGINE:** The Mistake Vault & SuperMemo SM-2 Spaced Repetition flashcards.
4. **FOCUS ENGINE:** High-precision timestamp deep-work timer with synthesized ambient soundscapes (100% offline).
5. **BAC JOURNEY:** Visual 6-stage curriculum mastery map with official coefficients across all Algerian BAC streams.

---

## 🎨 Signature Visual Identity & Design System
- **Brand:** FOCUS & FORCE
- **Tagline:** Study With Purpose
- **Creator:** by Rayane
- **Signature Aesthetics:** Creamy ivory (`#FBF9F5`), rich burgundy (`#721126`), soft blush (`#F5E6E8`), refined typography (`Cairo` for Arabic, `Plus Jakarta Sans` for Latin, `JetBrains Mono` for timers).

### 8 Signature Themes (Theme Studio)
1. **Cherry Cream (Signature):** Creamy ivory, deep burgundy, and soft rose blush.
2. **Burgundy Prestige:** Royal velvet burgundy with refined gold accents.
3. **Pink Cloud:** Gentle, calming pastel blush to alleviate exam stress.
4. **Lavender Dream:** Soothing lilac and amethyst for extended memorization sessions.
5. **Matcha Study:** Botanical sage and bamboo for mental clarity and exercise sprints.
6. **Ocean Calm:** Coastal navy and azure for structured, steady review.
7. **Midnight Focus:** High-contrast OLED dark mode for late-night revisions.
8. **Minimal Ivory:** Japanese stationery feel — pure, crisp, and distraction-free.

---

## 🌍 Trilingual Localization & True RTL
- **Arabic (Default):** Complete authentic Algerian BAC terminology with native right-to-left (`dir="rtl"`) layout.
- **French:** Full French interface tailored to Algerian high school terminology.
- **English:** Clean, modern productivity terminology.

---

## 🎓 Supported Algerian BAC Streams (Official Coefficients)
- **Sciences Expérimentales:** SNV (×6), Maths (×5), Physique-Chimie (×5), Arabe (×3), Philo (×2), HG (×2), Islamique (×2), Français (×2), Anglais (×2).
- **Mathématiques:** Maths (×7), Physique (×6), Arabe (×3), Philo (×2), HG (×2), Islamique (×2), Français (×2), Anglais (×2), SNV (×2).
- **Technique Mathématique:**
  - Génie Mécanique (Specialty ×6, Maths ×6, Physique ×6)
  - Génie Civil (Specialty ×6, Maths ×6, Physique ×6)
  - Génie Électrique (Specialty ×6, Maths ×6, Physique ×6)
  - Génie des Procédés (Specialty ×6, Maths ×6, Physique ×6)
- **Gestion et Économie:** Gestion financière & comptabilité (×6), Économie-Management (×5), Maths (×5), Droit (×2), HG (×4), Arabe (×3), etc.
- **Lettres et Philosophie:** Philosophie (×6), Langue Arabe (×6), Histoire-Géo (×4), Français (×3), Anglais (×3), Islamique (×2), Maths (×2).
- **Langues Étrangères:** Langue Arabe (×5), 3ème Langue [Espagnol/Allemand/Italien] (×5), Français (×5), Anglais (×5), Philo (×2), HG (×2), etc.

*All subjects, chapters, topics, and coefficients are editable and customizable in real-time.*

---

## 🚀 Key Feature Highlights

### 1. Rescue Mode (Turn Lost Time into a Focused Mission)
When fatigued or pressed for time, select available duration (10, 20, 30, 45, or 60 min), subject, energy level (Low, Normal, High), and activity (Understand, Memorize, Practise, Review Mistakes). Generates an actionable 3-phase micro-mission:
1. **Warm-up & Recall Primer** (15-20% time)
2. **Core Focus Sprint** (60-70% time)
3. **Active Recall Self-Test** (15-20% time)

### 2. The Mistake Vault (Student's Most Valuable Database)
Log errors with question prompt, attempted reasoning, model solution, root-cause categorization (`concept`, `formula`, `calc_error`, `misread`, `memorization`, `time_management`, `careless`), and difficulty rating. Test recall with hidden solutions and mark as resolved only through verified re-attempts.

### 3. Spaced Repetition (SuperMemo SM-2 Active Recall)
Leitner & SM-2 algorithm calculates next review intervals based on ratings (*Again, Hard, Good, Easy*). Tracks due cards, eases forgetting curve, and strengthens memory retention.

### 4. Deep Work Focus Room
Timestamp-based countdown immune to background tab throttling, distraction-free fullscreen mode, post-session reflection prompt, and native Web Audio API synthesized ambient noise (*Gentle Rain, Pure White Noise, Rhythmic Clockwork, Library Ambiance*).

### 5. Practice Lab & BAC Papers Archive
Record mock exam scores, track time limits, link mistakes directly to the vault, and access past examination papers organized by year and stream.

### 6. Realistic Performance Analytics
Interactive SVG charts tracking weekly study time by day (Sunday to Saturday), planned vs. completed task velocity, mistake category breakdowns, and data-backed actionable advice.

### 7. Private Study Space
Personal digital notebook for golden rules, formula cheat-sheets, links, and pinned summaries with search and tags.

### 8. Data Privacy & Offline PWA
- 100% Client-Side Private Storage with JSON Export/Import backup.
- Service Worker & Manifest for installable PWA experience on iOS, Android, and Desktop.

---

## 💻 Development & Execution

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Backend API, private study rooms & notifications

The optional API is an Express/Socket.IO service using PostgreSQL (Prisma) and Redis. The frontend remains local-first for planner data; backend accounts and live rooms are used when the API is deployed and configured.

### Local development

1. Provide PostgreSQL and Redis, then copy `.env.example` to `.env` and set `DATABASE_URL`, `REDIS_URL`, and three independent secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CSRF_SECRET`) of at least 32 characters.
2. Keep `FRONTEND_ORIGINS` as an exact comma-separated origin allowlist. For a local Vite frontend, use `http://localhost:5173`.
3. Generate the Prisma client and apply migrations: `npm run db:generate` then `npm run db:migrate`.
4. Start the frontend with `npm run dev` and, in a second terminal, start the API with `npm run dev:api`.
5. Set `VITE_API_BASE_URL` only when an HTTPS same-site reverse proxy gives the API a different origin. Prefer proxying `/api` and `/socket.io` on the frontend's own origin.

### Production requirements

- Set `NODE_ENV=production`, `TRUST_PROXY_HOPS` to the actual trusted proxy count, and `FRONTEND_ORIGINS` to the exact production app origin. Do not use `*`.
- Use TLS, managed PostgreSQL and Redis, rotate strong independent secrets, and keep `.env` out of source control. The API fails closed when Redis is missing in production.
- `SameSite=Strict`, `Secure`, `HttpOnly`, host-only cookies are used for access/refresh JWTs. Browser mutations require an HMAC-signed double-submit CSRF token and an allowed `Origin`. Socket connections validate the same cookie-backed session before room joins.
- Socket.IO rooms, chat messages and focus presence are restricted to the authenticated user's BAC stream. Messages are length-limited, sanitized and rate-limited; chat is public to authenticated platform students, so do not share personal information.
- Configure SMTP with `SMTP_URL` and `SMTP_FROM` for email. For Telegram, set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, and a random `TELEGRAM_WEBHOOK_SECRET`, then register `https://YOUR_API_HOST/api/notifications/telegram/webhook` with Telegram's `setWebhook` using the `secret_token` parameter. Students link through a short-lived, single-use bot start link; the API does not accept arbitrary chat IDs.
- The database outbox retries failed email/Telegram deliveries with backoff; the scheduled worker queues daily plan, overdue-task, due-card, streak-warning, and streak-milestone notifications. Configure provider monitoring and alerting before launch.

### API and validation

`npm run build:api` type-checks the API. `GET /healthz` is the readiness endpoint. Auth routes include CSRF token retrieval, register/login, refresh, logout, and current profile. Owner-scoped REST routes cover tasks, notes, mistakes, flashcards, focus logs, profile preferences, and Telegram linking. Socket.IO supports private-to-stream study rooms, presence, timer updates, focus boosts, and chat.

The migration source is `server/prisma/migrations/20261029000000_init/migration.sql`; the relational model is in `server/prisma/schema.prisma`. The frontend host and API must be same-site for the strict cookie policy. A GitHub Pages frontend on `github.io` cannot directly use `SameSite=Strict` cookies with an API hosted on `replit.app`; deploy the API behind a same-site proxy or host the frontend on the API's site.

The backend is not deployed or configured by this source change: provision the database, Redis, SMTP/Telegram credentials, TLS and same-site proxy before enabling live accounts or notifications. Local study records are not automatically migrated to a server account; export a JSON backup before changing devices.

## PWA and offline use

The service worker caches the app shell and same-origin versioned assets with a stale-while-revalidate strategy. It never caches API, socket, authentication, or tokenized requests. Planner, notes, mistakes, and timer continue using the existing local browser storage offline after the app has been opened once. Install prompts are shown where supported; iOS users can use Safari's Share → Add to Home Screen flow.

New installations start with empty personal records and zero tracked streaks; students set their own exam date and study preferences during onboarding/settings. JSON restore accepts complete version `2.0.0` backups only, validates them before changing state, and asks for confirmation because restore replaces the current local records.

---
*Crafted with precision for Algerian BAC students by Rayane.*
