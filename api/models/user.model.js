import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isStaff: { type: Boolean, default: false },
    teacherCode: { type: String, required: function () { return this.isStaff; } },
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

// Validate teacherCode
UserSchema.pre("save", function (next) {
  if (this.isStaff && this.teacherCode !== "Teacher@123") {
    return next(new Error("Invalid Teacher Code"));
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export { User };
