## Phase 8: Core Logic, Scoring & State Refactor
- **Objective:** Fix the critical/medium bugs identified in the diagnostic report and implement the defined business logic for skips and persistence.

### 1. Backend Stability & Data Integrity
- **Fix BUG 2 (CRITICAL):** Import the missing `Workout` model in `workoutController.js` to fix the ReferenceError on deletion.
- **Fix BUG 3 (MEDIUM):** In `updateWorkout` (`workoutService.js`), refactor the merge logic. Merge incoming exercises with existing exercises strictly by matching `_id` (not array index). This prevents history corruption when exercises are deleted or reordered.

### 2. The Scoring Algorithm & Skip Logic
- **Fix BUG 1 (CRITICAL):** Correct the impossible mathematical condition for the +3 bonus. Change it so it actually fires when weight increases but reps drop slightly (e.g., reps are between 80% and 99% of previous).
- **Implement Weighted Session Score (Bug 4 Fix):** - Each exercise has an equal mathematical weight in the session (`1 / totalExercises`).
  - The total session score is the sum of `(ExerciseScore * ExerciseWeight)`.
  - If a user skips an exercise, its contribution to the final session score is 0. The workout can be completed with skipped exercises, but the final score will be inherently lower.

### 3. Mid-Workout Persistence & DB Duplication
- **Local State (Fix BUG 5):** When a workout starts, save the session state (current index, completed exercises Set) to `localStorage` (e.g., `logym_active_workout`).
- **Resume Dialog:** When navigating to a workout page, check `localStorage`. If an active session exists for this workout, display a clean Dialog (using existing UI components): "Resume Workout or Start Over?".
  - "Resume" loads the state from `localStorage`.
  - "Start Over" clears the `localStorage` state and starts from index 0.
- **Prevent DB Duplicates (Fix BUG 6):** Refactor `updateExercise` in the backend. Instead of blindly `$push`-ing to the history arrays, check if the latest entry's date matches *today's date*. If it is today, *update/overwrite* that specific entry. Only push a new entry if today's date doesn't exist. This ensures restarting a workout safely overwrites the partial data without inflating the arrays.

## Workflow Instructions for Claude Code (Phase 8)
1. Execute the backend fixes (Stability & Prevent DB Duplicates) first.
2. Fix the Scoring algorithm in the service.
3. Move to the frontend to implement the LocalStorage persistence and Resume Dialog.
4. Stop and await further instructions once all 3 sections are completed and verified.