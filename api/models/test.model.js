import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  belongs: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  name: { type: String, required: true },
  desc: { type: String, default: "" },
  status: { type: String, enum: ["assigned", "late"], default: "assigned" },
  create_time: { type: Date, default: Date.now },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
});

// Validate that startTime is before endTime
TestSchema.pre("save", function (next) {
  if (this.start_time >= this.end_time) {
    return next(new Error("Start time must be before end time"));
  }
  next();
});

const Test = mongoose.model("Test", TestSchema);

export { Test };
