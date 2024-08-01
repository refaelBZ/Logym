// const db = require("../db");
// db.connect();

// const { default: mongoose } = require("mongoose");

// const exerciseSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },
//   sets: { 
//     type: Number, 
//     required: true 
//   },
//   reps: { 
//     type: Number, 
//     required: true 
//   },
//   muscleGroup: { 
//     type: String, 
//     required: true 
//   },
//   done: { 
//     type: Boolean, 
//     default: false 
//   },
//   currentWeight: { 
//     type: Number 
//   },
//   currentReps: { 
//     type: Number 
//   },
//   currentSets: { 
//     type: Number 
//   },
//   difficulty: { 
//     type: Number, 
//     min: 1, 
//     max: 10, 
//     default: 5 
//   },
//   lastdoneDate: { 
//     type: Date 
//   },
//   lastWeight: { 
//     type: Number 
//   },
//   lastReps: { 
//     type: Number 
//   },
//   lastSets: { 
//     type: Number 
//   },
//   lastDifficulty: { 
//     type: Number, 
//     min: 1, 
//     max: 10 
//   },
//   notes: { 
//     type: String 
//   }
// });

// const exerciseModel = mongoose.model("Exercise", exerciseSchema);

// module.exports = exerciseModel;
