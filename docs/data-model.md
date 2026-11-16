# Data Model

## Overview

MongoDB via Mongoose. Two primary collections: **User** and **Workout**. Workouts embed exercises (subdocuments) with per-metric history arrays.

## Entities

### User

Defined in [Server/User/user.model.js](../Server/User/user.model.js).

| Field | Notes |
| --- | --- |
| `username` | Required |
| `email` | Unique, lowercased, trimmed |
| `password` | Hashed; `select: false` by default |
| `resetPasswordToken` / `resetPasswordExpires` | Password-reset flow; not selected by default |
| `permission` | `user` \| `trainer` \| `admin` (default `user`) |
| `workouts` | Array of Workout ObjectIds |
| `stepSize` | Weight step preference (1–10, default 1) |
| `isActive` | Soft flag (default true) |
| `createdDate` | Default now |

### Workout

Defined in [Server/workout/workoutModel.js](../Server/workout/workoutModel.js).

| Field | Notes |
| --- | --- |
| `name` | Required |
| `description` | Optional |
| `exercises` | Required array of embedded exercises |
| `numberOfExercises` | Optional count |
| `completionRate` | Session score aggregate (weighted average of today’s exercise scores) |
| `startDate` / `lastDate` | Lifecycle timestamps |
| `status` | `In Progress` \| `Completed` |
| `generalNotes` | Optional |
| `user` | Ref to User |
| `duration` | Optional |
| `isActive` | Soft flag |
| `isArchived` | Hidden from primary lists when true |

### Exercise (embedded)

| Field | Notes |
| --- | --- |
| `name`, `sets`, `reps`, `muscleGroup` | Required template fields |
| `done`, `lastdoneDate` | Per-session completion markers |
| `lastWeight`, `lastReps`, `lastSets`, `lastDifficulty` | Latest logged values |
| `notes` | Free text |
| `isActive` | Soft flag |
| `weightHistory`, `repsHistory`, `setsHistory`, `difficultyHistory`, `scoreHistory` | `{ value, date }` style entries |

## Relationships

- User **has many** Workouts (`user` on Workout; optional `workouts` array on User).
- Workout **embeds many** Exercises — exercise identity is the subdocument `_id`.
- Progress charts and scoring read exercise history arrays, not separate Progress collections.

## Behavioral Constraints

- Creating a workout seeds history arrays when empty (see workout service `createWorkout`).
- Updating an exercise on the same calendar day overwrites that day’s history/score entry.
- Merging workout edits should match exercises by `_id` to avoid corrupting history when order changes.
- Archiving sets `isArchived` without deleting history.

## Related Documentation

- [Architecture](architecture.md)
- [Workouts feature](features/workouts.md)
- [Progress & scoring](features/progress-scoring.md)
