import bcrypt from "bcrypt";
import { Classroom } from "../models/classroom.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";
import { Test } from "../models/test.model.js";
import { TestTaken } from "../models/testTaken.model.js";
import { compareAsc } from "date-fns";
import jwt from 'jsonwebtoken';


// Dashboard
export const dashboard = async (req, res) => {
  try {
    let blue = "bg-blue-300", orange = "bg-orange-300", green = "bg-green-300", red = "bg-red-300", pink = "bg-purple-300", purple = "bg-pink-300"

    const colors = [ blue, orange, green, red, purple, pink ];
    let rooms = [];

    if (req.user.isStaff) {
      rooms = await Classroom.find({ owner: req.user._id });
    } else {
      const enrollments = await Enrollment.find({ student: req.user._id }).select("room");
      const roomIds = enrollments.map((e) => e.room);
      rooms = await Classroom.find({ _id: { $in: roomIds } });
    }

    rooms = rooms.map((room, index) => ({
      ...room.toObject(),
      color: colors[ index % colors.length ],
      // delay: (index + 2) * 100,
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      user: req.user,
      rooms
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// View Class
export const viewClass = async (req, res) => {
  const classId = req.params.classId

  let tests = Test.find({ belongs: classId }).sort({ create_time: -1 });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const totalTests = await Test.countDocuments({ belongs: classId });
  tests = await tests.skip((page - 1) * limit).limit(limit);

  if (!req.user.isStaff) {
    await Promise.all(
      tests.map(async (t) => {
        let testTakenEntry = await TestTaken.findOne({ student: req.user._id, test: t._id });

        // console.log(testTakenEntry.submittedAt);

        let newStatus;
        let newTestTakenStatus;
        const now = new Date();

        if (testTakenEntry) {
          if (testTakenEntry.submittedAt != null) {
            newTestTakenStatus = "done";
          } else {
            newTestTakenStatus = "not";
          }
        } else if (t.end_time && compareAsc(new Date(t.end_time), now) > 0) {
          newStatus = "assigned";
        } else {
          newStatus = "late";
        }

        // Update status in Test model if changed
        if (t.status !== newStatus) {
          await Test.findByIdAndUpdate(t._id, { status: newStatus }, { new: true });
        }
        if (!testTakenEntry) {
          // Create a new TestTaken entry if it doesn't exist
          testTakenEntry = new TestTaken({
            student: req.user._id,
            test: t._id,
            status: "not",
          });
          // console.log("Creating new TestTaken entry:", testTakenEntry);
        } else if (testTakenEntry.status !== newTestTakenStatus) {
          // Update status if changed
          testTakenEntry.status = newTestTakenStatus;
        }
        await testTakenEntry.save();
      })
    );
  }

  const testTakenList = await Promise.all(
    tests.map(async (t) => {
      return await TestTaken.findOne({ student: req.user._id, test: t._id }) || null;
    })
  );

  const room = await Classroom.findById(classId);
  return res.status(200).json({
    success: true,
    message: "Class fetched successfully",
    user: req.user,
    room,
    tests,
    totalTests,
    testTaken: testTakenList,
  });
};

// People in Classroom
export const people = async (req, res) => {
  const room = await Classroom.findById(req.params.classId);
  const teacher = await User.findById(room.owner);
  const enrollments = await Enrollment.find({ room: req.params.classId }).populate("student");
  const students = enrollments.map((e) => e.student);
  
  return res.status(200).json({
    success: true,
    message: "People fetched successfully",
    teacher,
    students
  });
};

// Profile Update
export const profile = async (req, res) => {
    try {
      const newUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
  
      if (!newUser) {
        return res.status(404).json({ message: "Classroom not found" });
      }
  
      res.status(200).json({ message: "User updated successfully", newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Password Change
export const passwordChange = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare old password with the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    // Respond with success
    return res.status(200).json({ success: true, message: "Password successfully updated!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// Signup
export const signup = async (req, res) => {

  try {
    const { name, email, password, isStaff } = req.body;
    if (await User.findOne({ email })) throw new Error("Email already exists");
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password, isStaff });
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    req.flash("error", error.message);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Username or password incorrect");
    req.session.user = user;

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, })
      .json({
        success: true,
        message: "User fetched successfully",
        user: user,
      });

  } catch (error) {
    req.flash("error", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    return res.status(200).json({
      success: true,
      message: "User looged out successfully",
    });
  });
};
