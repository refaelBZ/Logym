# Workouts

## Overview

Core product loop: define workouts with exercises, run a session while logging weight/reps/sets/difficulty, and manage templates (edit, archive, delete).

## Behavior

### Template management

- List workouts for the authenticated user (`GET /workout`).
- Create workout with at least one exercise (`POST /workout`); validates name, sets, reps, muscle group.
- Update workout structure (`PUT /workout/:workoutId`); exercise merge should preserve history by matching exercise `_id`.
- Delete exercise (`DELETE /workout/:workoutId/exercises/:exerciseId`).
- Delete workout (`DELETE /workout/:workoutId`).
- Archive / unarchive (`PATCH /workout/:workoutId/archive` with `isArchived`).

### Live session

- Workout page walks exercises one at a time and submits updates via `PUT /workout/:workoutId/exercises/:exerciseId`.
- Logging updates last-* fields and history arrays; same-day logs overwrite today’s entries.
- Completing an exercise can mark `done` and refresh `lastdoneDate`.
- Session score contribution updates workout `completionRate` (see [progress-scoring](progress-scoring.md)).

### Mid-workout resume

- Client persists `{ workoutId, current index, completed exercises }` under `logym_active_workout`.
- Returning to the workout page offers Resume vs Start Over.
- Clearing/completing the session removes the storage key; abandoning mid-way intentionally keeps it for resume.

### Client UX

- Home lists workouts (sorted by `lastDate`), supports delete/archive actions.
- Add / Edit workout pages manage exercise lists before save.
- `stepSize` from the user profile controls weight picker increments during logging.

## Architecture

- API: [Server/workout/workoutRouter.js](../../Server/workout/workoutRouter.js) → [workoutService.js](../../Server/workout/workoutService.js) → [workoutController.js](../../Server/workout/workoutController.js) → [workoutModel.js](../../Server/workout/workoutModel.js)
- Session UI: [Client/src/pages/Workout/index.jsx](../../Client/src/pages/Workout/index.jsx)
- Home / Add / Edit: under [Client/src/pages/](../../Client/src/pages/)

## Edge Cases

- Ownership: services reject workouts that do not belong to `req.user.userId`.
- Empty history on create is seeded with initial entries so scoring has a baseline.
- Skipped exercises do not add today’s score; they lower the session average.
- `algo.js` holds experimental/sample scoring data; production scoring lives in `workoutService.calculateExerciseScore`.

## Source References

- [workoutRouter.js](../../Server/workout/workoutRouter.js)
- [workoutService.js](../../Server/workout/workoutService.js)
- [workoutController.js](../../Server/workout/workoutController.js)
- [workoutModel.js](../../Server/workout/workoutModel.js)
- [Workout page](../../Client/src/pages/Workout/index.jsx)
- [Home page](../../Client/src/pages/Home/index.jsx)
- [AddWorkout page](../../Client/src/pages/AddWorkout/index.jsx)
- [EditWorkout page](../../Client/src/pages/EditWorkout/index.jsx)

## Related Documentation

- [Progress & scoring](progress-scoring.md)
- [Data model](../data-model.md)
- [Architecture](../architecture.md)
