const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: { 
    type: String, 
    required: true 
  },
  sets: { 
    type: Number, 
    required: true 
  },
  reps: { 
    type: Number, 
    required: true 
  },
  muscleGroup: { 
    type: String, 
    required: true 
  },
  done: { 
    type: Boolean, 
    default: false 
  },
  lastdoneDate: { 
    type: Date 
  },
  lastWeight: { 
    type: Number 
  },
  lastReps: { 
    type: Number 
  },
  lastSets: { 
    type: Number 
  },
  lastDifficulty: { 
    type: Number, 
    min: 1, 
    max: 10 
  },
  notes: { 
    type: String 
  },
  weightHistory: [
    {
      weight: { type: Number },
      date: { type: Date }
    }
  ],
  repsHistory: [
    {
      reps: { type: Number },
      date: { type: Date }
    }
  ],
  setsHistory: [
    {
      sets: { type: Number },
      date: { type: Date }
    }
  ],
  difficultyHistory: [
    {
      difficulty: { type: Number, min: 1, max: 10 },
      date: { type: Date }
    }
  ],
  scoreHistory: [
    {
      score: { type: Number, min: 0, max: 10 },
      date: { type: Date }
    }
  ]
});


const workoutSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  exercises: { 
    type: [exerciseSchema], 
    required: true 
  },
  numberOfExercises: { 
    type: Number, 
  },
  completionRate: { 
    type: Number, 
    default: 0 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  lastDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['In Progress', 'Completed'], 
    default: 'In Progress' 
  },
  generalNotes: { 
    type: String 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  duration: { 
    type: Number 
  }
});

const workoutModel = mongoose.model("Workout", workoutSchema);
module.exports = workoutModel;
