import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer_file: { 
    data: Buffer, 
    contentType: String, 
  },
  actual_score: { type: Number, default: -1 },
});

const Answer = mongoose.model("Answer", AnswerSchema);

export { Answer };