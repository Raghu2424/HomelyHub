import { property } from "../Models/propertyModel.js"
import { Booking } from "../Models/bookingModel.js"
//createorder ; booking any property
const createOrder = async(req,res)=>{
    const{amount,propertyId,fromDate,toDate,guests} = req.body;

    //OrderID : oreder_387366757624
    const orderId = "oredr_" + Date.now();
    res.json({
        success:true,
        message:"order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })

}

//verifypayment
//25,26
// 1. save the booking
// 2. Block these dates

const verifypayment = async(req,res)=>{
    const{orderId, bookingDetails, forceStatus} = req.body;

    if(forceStatus === "success"){
        const paymentId = "pay_" + Date.now();

        //save booking
        const newBooking = await Booking.create({
            user: req.user._id,
            property: bookingDetails.propertyId,
            price: bookingDetails.price,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            guests: bookingDetails.guests,
            numberOfnights: bookingDetails.nights ?? bookingDetails.numberOfnights ?? 1,
            paid: true,
        });

        //tell property those dates are taken

        const updatedproperty = await property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                        bookingId:newBooking._id,
                        fromDate:bookingDetails.fromDate,
                        toDate:bookingDetails.toDate,
                        userId:req.user._id
                    }
                }
            },
            {new:true}
        );

        res.json({
            success:true,
            message:"payment successful, booking confirmed!!",
            paymentId,
            orderId,
            booking:newBooking
        });
    }else{
        res.status(400).json({
            success:false,
            message:"payment failed!",
            orderId
        })
    }

}

//get my bookings
const getUserBookings = async(req,res)=>{
    try{
        const bookings = await Booking.find({user:req.user._id});
        
        res.status(200).json({
        status:"success",
        data:{
            bookings
        }
    })

    }catch(error){
        res.status(401).json({
            status:"fails",
            message:error.message
        })
    }
}

//get one booking details
// /:id
const getBookingDetails = async(req,res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })

    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
    
}


export {getBookingDetails,getUserBookings,createOrder,verifypayment}
