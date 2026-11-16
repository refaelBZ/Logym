# Architecture

## Overview

Logym is a two-package fullstack app: a Vite React SPA talks to an Express REST API backed by MongoDB. Auth is JWT-based; the client stores the token in `localStorage` and attaches it on every API request.

## Components

```text
Browser (React SPA)  --HTTPS/JSON-->  Express API  --Mongoose-->  MongoDB
                           |
                      Nodemailer (password reset / welcome)
```

| Component | Location | Role |
| --- | --- | --- |
| Client SPA | [Client/](../Client/) | UI, routing, local session + mid-workout resume state |
| API entry | [Server/index.js](../Server/index.js) | CORS, JSON body, mounts routers, centralized errors |
| DB bootstrap | [Server/db.js](../Server/db.js) | Connects via `MONGO_URI`; exits if missing/unreachable |
| User domain | [Server/User/](../Server/User/) | Auth, profile, email |
| Workout domain | [Server/workout/](../Server/workout/) | Workout CRUD, exercise logging, scoring |

## Request Flow

1. Client calls `apiClient` ([Client/src/api.js](../Client/src/api.js)) with `VITE_API_URL` as base URL.
2. Request interceptor adds `Authorization: Bearer <logym_token>` when present.
3. Express routes under `/user` and `/workout` run validation and (where required) `authenticateToken`.
4. Routers delegate to services; services call model controllers (Mongoose).
5. Errors bubble to the centralized error middleware in [Server/index.js](../Server/index.js).
6. Client response interceptor surfaces messages via `ErrorContext`; `401` clears the token and reloads when a session existed.

## Client Structure

- Routing and auth gate live in [Client/src/components/Layout/index.jsx](../Client/src/components/Layout/index.jsx).
- Unauthenticated routes: `/login`, `/signup`, `/forgot`, `/reset/:token`.
- Authenticated routes: `/` and `/home`, `/workout/:workoutId`, `/add`, `/edit-workout/:workoutId`, `/progress`, `/settings`.
- Pages under [Client/src/pages/](../Client/src/pages/); shared UI under [Client/src/components/](../Client/src/components/).

## Server Structure

- MVC-style split per domain: router → service → controller → model.
- Mounted paths:
  - `/user` → [Server/User/user.router.js](../Server/User/user.router.js)
  - `/workout` → [Server/workout/workoutRouter.js](../Server/workout/workoutRouter.js)
- Default listen port: `process.env.PORT || 2500`.

## Important Decisions

- **JWT in localStorage** — simple SPA session; token lifetime 30 days (`SECRET_CODE`).
- **History arrays on exercises** — progress is stored as time-series entries on each exercise document, not separate session collections.
- **Idempotent daily history** — logging the same exercise again on the same calendar day overwrites today’s history entries instead of appending duplicates.
- **Weighted session score** — `completionRate` is the average of today’s exercise scores across active exercises (skipped/incomplete contribute 0 for that day).
- **Mid-workout resume** — client-only `localStorage` key `logym_active_workout`; server does not track in-progress UI state.

## Related Documentation

- [Data model](data-model.md)
- [Integrations](integrations.md)
- [Features index](features/INDEX.md)
