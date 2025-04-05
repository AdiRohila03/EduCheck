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
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard",ensureAuthenticated, dashboard);
router.get("/view_class/:classId", ensureAuthenticated,viewClass);
router.get("/view_class/people/:classId",ensureAuthenticated, people);
router.put("/profile",ensureAuthenticated, profile);
router.get("/profile",ensureAuthenticated, profile);
router.post("/password", ensureAuthenticated,passwordChange);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout",ensureAuthenticated, logout);

export default router;