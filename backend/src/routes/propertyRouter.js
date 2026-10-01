import express from "express";
import { getProperties, getProperty } from "../Controllers/propertyController.js";
import { requireDatabase } from "../utils/db.js";

const propertyRouter = express.Router()

propertyRouter.use(requireDatabase);
propertyRouter.route("/").get(getProperties)
propertyRouter.route("/:id").get(getProperty)

export{propertyRouter};