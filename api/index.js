import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import classroomRouter from './routes/classroom.route.js'
import studentRouter from './routes/student.route.js'
import teacherRouter from './routes/teacher.route.js'

dotenv.config();
const app = express();
app.use(express.json());

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

app.use("/api/classroom", classroomRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);``