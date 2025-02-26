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
    const colors = ["blue", "orange", "green", "red", "purple", "pink"];
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
      color: colors[index % colors.length],
      delay: (index + 2) * 100,
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
  const classId = req.params.class_id;
  let tests = Test.find({ belongs: classId }).sort({ create_time: -1 });

  // Search filter
  if (req.query.search) {
    tests = tests.where("name").regex(new RegExp(req.query.search, "i"));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const totalTests = await Test.countDocuments({ belongs: classId });
  tests = await tests.skip((page - 1) * limit).limit(limit);

  if (!req.user.isStaff) {
    tests = await Promise.all(
      tests.map(async (t) => {
        const testTakenEntry = await TestTaken.findOne({ student: req.user._id, test: t._id });
        if (testTakenEntry) {
          t.status = "done";
        } else if (!t.start_time || compareAsc(new Date(t.start_time), new Date()) < 0) {
          t.status = "Assigned";
        } else if (t.start_time && compareAsc(new Date(t.start_time), new Date()) > 0) {
          t.status = "not";
        } else {
          t.status = "late";
        }
        return t;
      })
    );
  }

  const room = await Classroom.findById(classId);
  res.render("classroom/view_class", { tests, room });
};

// People in Classroom
export const people = async (req, res) => {
  const room = await Classroom.findById(req.params.class_id);
  const enrollments = await Enrollment.find({ room: req.params.class_id }).populate("student");
  const students = enrollments.map((e) => e.student);
  res.render("classroom/people", { teacher: room.owner, students });
};

// Profile Update
export const profile = async (req, res) => {
  if (req.method === "POST") {
    try {
      await User.findByIdAndUpdate(req.user._id, req.body);
      req.flash("success", `${req.user.name} Modified.`);
      return res.redirect("/dashboard");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
  res.render("/profile", { user: req.user });
};

// Password Change
export const passwordChange = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
      req.flash("success", "Your password has been successfully updated!");
      
      return res.status(200).json({ success: true })
    } catch (error) {
      req.flash("error", error.message);
    }
};

// Signup
export const signup = async (req, res) => {
   
    try {
      const { name, email, password, isStaff } = req.body;
      if (await User.findOne({ email })) throw new Error("Email already exists");
      // const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ name, email, password, isStaff});
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
    return res.status(500).json({ success: false, message: error.message});
  }
};

// Logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    return res.status(200).json({
      success: true,
      message: "User looged out successfully",
    });  });
};
