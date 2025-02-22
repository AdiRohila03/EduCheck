import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer_text: { type: String, required: true },
  ml_score: { type: Number, default: 10 },
  actual_score: { type: Number, default: 10 },
});

const Answer = mongoose.model("Answer", AnswerSchema);

export { Answer };