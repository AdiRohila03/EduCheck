import bcrypt from "bcrypt";
import { Classroom } from "../models/classroom.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";
import { Test } from "../models/test.model.js";
import { TestTaken } from "../models/testTaken.model.js";
import { compareAsc } from "date-fns";

// Home Page
export const home = (req, res) => {
  res.render("classroom/home");
};

// Dashboard
export const dashboard = async (req, res) => {
  const colors = [ "blue", "orange", "green", "red", "purple", "pink" ];
  let rooms;
  if (req.user.is_staff) {
    rooms = await Classroom.find({ owner: req.user._id });
  } else {
    const enrollments = await Enrollment.find({ student: req.user._id }).select("room_id");
    const roomIds = enrollments.map((e) => e.room_id);
    rooms = await Classroom.find({ _id: { $in: roomIds } });
  }

  rooms = rooms.map((room, index) => ({
    ...room.toObject(),
    color: colors[ index % colors.length ],
    delay: (index + 2) * 100,
  }));

  res.render("classroom/dashboard", { rooms });
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

  if (!req.user.is_staff) {
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
  res.render("classroom/profile", { user: req.user });
};

// Password Change
export const passwordChange = async (req, res) => {
  if (req.method === "POST") {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
      req.flash("success", "Your password has been successfully updated!");
      return res.redirect("/dashboard");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
  res.render("classroom/password");
};

// Signup
export const signup = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { name, email, password, is_staff } = req.body;
      if (await User.findOne({ email })) throw new Error("Email already exists");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, is_staff: is_staff === "on" });
      await newUser.save();
      return res.redirect("/login");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
  res.render("classroom/login");
};

// Login
export const login = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Username or password incorrect");
      req.session.user = user;
      return res.redirect("/dashboard");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
  res.render("classroom/login");
};

// Logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
};
