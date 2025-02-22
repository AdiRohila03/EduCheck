import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  desc: { type: String, default: "" },
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
