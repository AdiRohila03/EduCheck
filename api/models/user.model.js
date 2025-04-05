import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isStaff: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Split name before saving
UserSchema.pre("save", function (next) {
  if (this.name) {
    const nameParts = this.name.trim().split(" ");
    this.firstName = nameParts[0]; // First word as firstName
    this.lastName = nameParts.slice(1).join(" ") || " "; // Remaining words as lastName
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

export { User };