import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  qn_text: { type: String, required: true },
  key: { type: String, required: true },
  max_score: { type: Number, default: 100 },
});

// Ensure maxScore is always positive
QuestionSchema.pre("save", function (next) {
  if (this.max_score < 0) {
    return next(new Error("Maximum score cannot be negative"));
  }
  next();
});

const Question = mongoose.model("Question", QuestionSchema);

export { Question };
