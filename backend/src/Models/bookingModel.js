//which property???
//who is the user
//price
//dates
//guests,
//paid

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "property",
      required: [true, "Booking must belong to a property"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },

    price: {
      type: Number,
      required: [true, "Booking must have price"],
    },

    createAt: {
      type: Date,
      default: Date.now,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    fromDate: {
      type: Date,
    },
    toDate: {
      type: Date,
    },
    guests: {
      type: Number,
      default: 1,
    },
    numberOfnights: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function () {
  this.populate("user");
  this.populate({
    path: "property",
    select: "maximumGuest images propertyName address",
  });
});

const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };