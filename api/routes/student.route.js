import express from "express";
import {
  joinClassroom,
  attendTest,
  submitTest,
  reviewTest,
  assignedTests,
  missingTests,
  doneTests,

  // testTaken
} from "../controllers/student.controller.js";
import { ensureAuthenticated, studentRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/join_class", ensureAuthenticated, studentRequired, joinClassroom);
router.get("/attend_test/:testId", ensureAuthenticated, studentRequired, attendTest);
router.post("/submit_test/:testId", ensureAuthenticated, studentRequired, submitTest);
router.get("/review_test/:testId", ensureAuthenticated, studentRequired, reviewTest);
router.get("/assigned_tests/:classId", ensureAuthenticated, studentRequired, assignedTests);
router.get("/missing_tests/:classId", ensureAuthenticated, studentRequired, missingTests);
router.get("/done_tests/:classId", ensureAuthenticated, studentRequired, doneTests);


// router.post("/testTaken", ensureAuthenticated, studentRequired, testTaken);

export default router;