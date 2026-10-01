import express from "express";
import { cretaeTripPlan } from "../Controllers/tripController.js";

const tripRouter = express.Router();
tripRouter.route("/").post(cretaeTripPlan)

export {tripRouter};