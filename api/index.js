import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import session from "express-session";
import flash from "connect-flash";
import classroomRouter from './routes/classroom.route.js'
import studentRouter from './routes/student.route.js'
import teacherRouter from './routes/teacher.route.js'

dotenv.config();
const app = express();
app.use(express.json());

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use `true` in production with HTTPS
}));

// Flash middleware
app.use(flash());

// Make flash messages available globally
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.log(`MONGODB Connection Error: ${err}`);
  });
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.use("/api", classroomRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});