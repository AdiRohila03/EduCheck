import mongoose from "mongoose";

const TestTakenSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submittedAt: { type: Date, default: Date.now },
  ml_score: { type: Number, default: 0 },
  actual_score: { type: Number, default: 0 },
}, { uniqueIndexes: { test: 1, student: 1 } });

module.exports = mongoose.model("TestTaken", TestTakenSchema);
