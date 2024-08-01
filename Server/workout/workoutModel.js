const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
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
  currentWeight: { 
    type: Number 
  },
  currentReps: { 
    type: Number 
  },
  currentSets: { 
    type: Number 
  },
  difficulty: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
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
  }
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
    required: true 
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
