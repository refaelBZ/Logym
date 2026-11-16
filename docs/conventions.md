# Conventions

## Overview

Patterns that appear consistently across the Logym codebase. Prefer matching these when extending features.

## Server

- **Domain folders** — `Server/User/` and `Server/workout/` each own router, service, controller/model (and auth/email where needed).
- **Error handling** — handlers call `next(error)` with optional `error.statusCode`. Central middleware maps Mongoose `ValidationError`, `CastError`, and duplicate-key `11000`.
- **Auth gate** — protected routes use `authenticateToken` from [Server/User/auth.js](../Server/User/auth.js); JWT payload exposes `userId`.
- **Ownership checks** — workout reads/updates filter by `req.user.userId` in the service layer.
- **Validation** — `express-validator` on signup/login/password and workout create/update bodies.
- **Env** — `dotenv` loaded in entry and DB modules; never commit secrets.

## Client

- **Page + component folders** — each page/component is a folder with `index.jsx` and often `style.module.scss`.
- **API access** — prefer shared [Client/src/api.js](../Client/src/api.js) (`apiClient`) over ad-hoc Axios instances.
- **Session keys** — `logym_token`, `logym_userEmail`, `logym_active_workout` in `localStorage`.
- **Auth UX** — login state is derived from `logym_token`; Layout switches route trees accordingly.
- **Styling** — SCSS modules + shared mixins in [Client/src/mixins.scss](../Client/src/mixins.scss); mobile-first.
- **Global errors** — [Client/src/context/ErrorContext.jsx](../Client/src/context/ErrorContext.jsx) + response interceptor.

## Naming

- Client routes use kebab-case paths (`/edit-workout/:workoutId`).
- Server workout paths use REST nouns (`/workout/:workoutId/exercises/:exerciseId`).
- User API mixes resource style (`POST /user/signup`, `POST /user/login`, `GET /user/:id` where `:id` is email).

## Related Documentation

- [Architecture](architecture.md)
- [Features index](features/INDEX.md)
