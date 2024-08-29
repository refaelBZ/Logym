const weightHistory = [
    {
        "weight": 70,
        "date": "2024-08-12T10:15:00Z"

    },
    {
        "weight": 80,
        "date": "2024-08-12T10:30:00Z"
    },
    {
        "weight": 90,
        "date": "2024-08-12T10:45:00Z"
    },
    {
        "weight": 100,
        "date": "2024-08-12T11:00:00Z"
    }
]

let repsHistory = [
    {
        "reps": 10,
        "date": "2024-08-12T10:15:00Z"
    },
    {
        "reps": 12,
        "date": "2024-08-12T10:30:00Z"
    },
    {
        "reps": 14,
        "date": "2024-08-12T10:45:00Z"
    },
    {
        "reps": 20,
        "date": "2024-08-12T11:00:00Z"
    }
]

let setsHistory = [
    {
        "sets": 3,
        "date": "2024-08-12T10:15:00Z"
    },
    {
        "sets": 3,
        "date": "2024-08-12T10:30:00Z"
    },
    {
        "sets": 3,
        "date": "2024-08-12T10:45:00Z"
    },
    {
        "sets": 4,
        "date": "2024-08-12T11:00:00Z"
    }
]

let difficultyHistory = [
    {
        "difficulty": 8,
        "date": "2024-08-12T10:15:00Z"
    },
    {
        "difficulty": 7,
        "date": "2024-08-12T10:30:00Z"
    },
    {
        "difficulty": 8,
        "date": "2024-08-12T10:45:00Z"
    },
    {
        "difficulty": 8,
        "date": "2024-08-12T11:00:00Z"
    }
]

function calculateExerciseScore(weightHistory, repsHistory, setsHistory, difficultyHistory) {
    // Defining score parameters as constants within the function
    const weightIncreaseScore = 4;
    const weightDecreaseScore = -2;
    const weightExtremeDecreaseScore = -4;

    const repsIncreaseScore = 4;
    const repsDecreaseScore = -2;
    const repsExtremeDecreaseScore = -4;

    const setsIncreaseScore = 1.5;
    const setsDecreaseScore = -0.75;
    const setsExtremeDecreaseScore = -1.5;

    const difficultyIncreaseScore = 0.5;
    const difficultyDecreaseScore = -0.25;
    const difficultyExtremeDecreaseScore = -0.5;

    // Helper function to calculate score
    function calculateScore(current, previous, increaseScore, decreaseScore, extremeDecreaseScore) {
        if (current > previous) {
            return increaseScore;
        } else if (current < previous * 0.9) {
            return extremeDecreaseScore;
        } else if (current < previous) {
            return decreaseScore;
        } else {
            return 0;
        }
    }

    // Base score
    let score = 5;

    // Calculate scores for each parameter
    score += calculateScore(weightHistory[weightHistory.length - 1].weight, weightHistory[weightHistory.length - 2].weight, weightIncreaseScore, weightDecreaseScore, weightExtremeDecreaseScore);
    score += calculateScore(repsHistory[repsHistory.length - 1].reps, repsHistory[repsHistory.length - 2].reps, repsIncreaseScore, repsDecreaseScore, repsExtremeDecreaseScore);
    score += calculateScore(setsHistory[setsHistory.length - 1].sets, setsHistory[setsHistory.length - 2].sets, setsIncreaseScore, setsDecreaseScore, setsExtremeDecreaseScore);
    score += calculateScore(difficultyHistory[difficultyHistory.length - 1].difficulty, difficultyHistory[difficultyHistory.length - 2].difficulty, difficultyIncreaseScore, difficultyDecreaseScore, difficultyExtremeDecreaseScore);

    // Special logic for significant weight increase and slight reps decrease
    if (weightHistory[weightHistory.length - 1].weight > weightHistory[weightHistory.length - 2].weight * 1.1 && 
        repsHistory[repsHistory.length - 1].reps < repsHistory[repsHistory.length - 2].reps * 0.9 && 
        repsHistory[repsHistory.length - 1].reps > repsHistory[repsHistory.length - 2].reps * 0.9) {
        score += 3; // negate the slight reps decrease
    }

    // Ensure the score is within the 0-10 range
    return Math.max(0, Math.min(10, score));
}

