# Progress & Scoring

## Overview

Tracks improvement over time with per-exercise history arrays and a 0–10 score. The Progress page visualizes history with Chart.js. Session-level `completionRate` aggregates today’s exercise scores.

## Behavior

### Exercise score

Computed in `calculateExerciseScore` inside [workoutService.js](../../Server/workout/workoutService.js) whenever an exercise is logged:

- Base score starts at 5.
- Compares latest vs previous entries for weight, reps, sets, and difficulty with fixed deltas (increases reward; mild/extreme decreases penalize).
- **Bonus +3** when weight rises more than 10% and reps fall only slightly (current reps between 80% and 99% of previous).
- Result clamped to 0–10 (ceil).
- Written to `scoreHistory` with same-day overwrite semantics.

### Session score (`completionRate`)

- Active exercises each have equal weight (`1 / totalActive`).
- Sum of today’s exercise scores divided by active exercise count.
- Exercises without a score logged today contribute 0 for that session average.

### Progress UI

- [Client/src/pages/Progress/index.jsx](../../Client/src/pages/Progress/index.jsx) renders charts from workout/exercise history.
- Chart component: [Client/src/components/Chart/](../../Client/src/components/Chart/).
- Score presentation helpers: [ScoreBar](../../Client/src/components/ScoreBar/), [ProgressBar](../../Client/src/components/ProgressBar/).

## Architecture

- Scoring is server-side and authoritative; client displays returned workout documents.
- History lives on embedded exercises (see [data-model](../data-model.md)), not a separate analytics store.
- [Server/workout/algo.js](../../Server/workout/algo.js) is a standalone scoring sketch with sample data — not the live path used by the API.

## Edge Cases

- First-ever log (insufficient history length) applies only the base score components that have ≥2 points.
- Restarting a workout the same day overwrites history/score for that day instead of duplicating points.
- Archived workouts still retain history; Progress page receives the workouts list from Layout state.

## Source References

- [workoutService.js](../../Server/workout/workoutService.js) (`calculateExerciseScore`, `updateExercise`)
- [workoutModel.js](../../Server/workout/workoutModel.js) (history schemas)
- [Progress page](../../Client/src/pages/Progress/index.jsx)
- [Chart component](../../Client/src/components/Chart/index.jsx)

## Related Documentation

- [Workouts](workouts.md)
- [Data model](../data-model.md)
- [Features index](INDEX.md)
