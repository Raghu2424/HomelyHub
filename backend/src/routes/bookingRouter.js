import express from "express";
const bookingRouter = express.Router();

import{
    getBookingDetails,getUserBookings,createOrder,verifypayment
}from "../Controllers/bookingController.js"

import { protect } from "../Controllers/authController.js"
import { requireDatabase } from "../utils/db.js"

bookingRouter.use(requireDatabase);
bookingRouter.get("/",protect,getUserBookings);
bookingRouter.get("/:bookingId",protect,getBookingDetails);
bookingRouter.post("/create-order",protect,createOrder);
bookingRouter.post("/verify-payment",protect,verifypayment)

export{bookingRouter};
