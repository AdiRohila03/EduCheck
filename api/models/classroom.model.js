import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  desc: { type: String, default: "" },
});

const Classroom = mongoose.model("Classroom", ClassroomSchema);

export { Classroom };
