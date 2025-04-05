import mongoose from "mongoose";

const TestTakenSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submittedAt: { type: Date, default: null },
  // ml_score: { type: Number, default: 0 },
  // actual_score: { type: Number, default: 0 },
  status: { type: String, enum: ["done", "not"], default: "not" }
});

// Ensure a student can take a test only once
TestTakenSchema.index({ test: 1, student: 1 }, { unique: true });

const TestTaken = mongoose.model("TestTaken", TestTakenSchema);
export { TestTaken };