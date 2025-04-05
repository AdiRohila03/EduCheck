import express from "express";
import { body } from "express-validator";
import { ensureAuthenticated, teacherRequired } from "../middleware/authMiddleware.js";
import {
  createClassroom,
  updateClassroom,
  deleteClassroom,
  createTest,
  updateTest,
  deleteTest,
  viewTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  studentWork,
  updateWork
} from "../controllers/teacher.controller.js";

const router = express.Router();

// Classroom routes
router.post("/create_class", ensureAuthenticated, teacherRequired, createClassroom);
router.put("/update_class/:classId", ensureAuthenticated, teacherRequired, updateClassroom);
router.get("/view_class/:classId", ensureAuthenticated, teacherRequired, updateClassroom);
router.delete("/delete_class/:classId", ensureAuthenticated, teacherRequired, deleteClassroom);

// Test routes
router.post("/create_test/:classId", ensureAuthenticated, teacherRequired, createTest);
router.put("/update_test/:testId", ensureAuthenticated, teacherRequired, updateTest);
router.delete("/delete_test/:testId", ensureAuthenticated, teacherRequired, deleteTest);
router.get("/view_test/:testId", ensureAuthenticated, teacherRequired, viewTest);

// Question routes
router.post("/test/create_qn/:testId", ensureAuthenticated, teacherRequired, createQuestion);
router.put("/update_qn/:qnId", ensureAuthenticated, teacherRequired, updateQuestion);
router.get("/view_qn/:qnId", ensureAuthenticated, teacherRequired, updateQuestion);
router.delete("/delete_qn/:qnId", ensureAuthenticated, teacherRequired, deleteQuestion);

// Student_Work routes
router.get("/students_work/:testId", ensureAuthenticated, teacherRequired, studentWork);
router.patch("/update_work", ensureAuthenticated, teacherRequired, [
  body("actual_score").isNumeric().withMessage("Score must be a number")
], updateWork);

export default router;
