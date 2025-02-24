import express from "express";
import {
  dashboard,
  viewClass,
  people,
  profile,
  passwordChange,
  signup,
  login,
  logout,
} from "../controllers/classroom.controller.js";

const router = express.Router();

router.get("/dashboard", dashboard);
router.get("/view_class/:classId", viewClass);
router.get("/view_class/:classId/people", people);
router.get("/profile", profile);
router.post("/password", passwordChange);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
