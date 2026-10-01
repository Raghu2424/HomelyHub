import express from "express";

import {
  check,
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updateMe,
  updatePassword,
} from "../Controllers/authController.js";
import { writeDescription } from "../Controllers/tripController.js";

import { createProperty, getUsersProperties } from "../Controllers/propertyController.js";
import { requireDatabase } from "../utils/db.js";

const router = express.Router();

router.route("/signup").post(requireDatabase, signup);
router.route("/login").post(requireDatabase, login);
router.route("/logout").get(logout);
router.route("/updateMe").patch(requireDatabase, protect, updateMe);
router.route("/updateMyPassword").patch(requireDatabase, protect, updatePassword);
router.route("/forgotPassword").post(requireDatabase, forgotPassword);
router.route("/resetPassword/:token").patch(requireDatabase, resetPassword);
router.route("/me").get(requireDatabase, protect, check);
router.route("/generateDescription").post(requireDatabase, protect, writeDescription)


router.route("/newAccommodation").post(requireDatabase, protect, createProperty);
router.route("/myAccommodation").get(requireDatabase, protect, getUsersProperties);

export { router };
