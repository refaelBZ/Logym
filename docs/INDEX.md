# Logym Documentation

Logym is a mobile-first workout tracking web app. Users log sets, reps, weight, and effort during sessions, then review progress through charts and session scores.

## Purpose

- Capture workout performance in real time
- Persist exercise history (weight, reps, sets, difficulty, scores)
- Motivate users with visual progress and daily/session scoring

## Technology Stack

| Layer | Stack |
| --- | --- |
| Client | React 18, Vite, React Router, Axios, Chart.js, SCSS modules |
| Server | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT (`SECRET_CODE`), bcryptjs |
| Email | Nodemailer (welcome + password reset) |
| Deploy | Client on Vercel; API is a separate Node service |

## Repository Layout

```text
Client/     React SPA (Vite)
Server/     Express API + MongoDB models
docs/       Agent-oriented project documentation (this tree)
```

## Major Subsystems

| Subsystem | Responsibility | Docs |
| --- | --- | --- |
| Authentication | Signup, login, JWT sessions, password reset | [features/authentication](features/authentication.md) |
| Workouts | CRUD workouts/exercises, live logging, archive, mid-session resume | [features/workouts](features/workouts.md) |
| Progress & scoring | Exercise/session scores and progress charts | [features/progress-scoring](features/progress-scoring.md) |

## Documentation Map

- [Architecture](architecture.md) — components, boundaries, request flow
- [Conventions](conventions.md) — patterns used across Client and Server
- [Data model](data-model.md) — User, Workout, Exercise entities
- [Integrations](integrations.md) — MongoDB, email, CORS, env vars, hosting
- [Features index](features/INDEX.md) — feature catalog

## Live Demo

- [https://logym.vercel.app/](https://logym.vercel.app/)
