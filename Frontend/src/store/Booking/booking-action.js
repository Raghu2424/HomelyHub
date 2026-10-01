import {axiosInstance} from "../../utils/axios"
import { setBookingDetails, setBookings } from "./booking-slice"

//fetch bookings details
export const fetchBookingDetials =(bookingId) => async(dispatch)=>{
    try{
        const response = await axiosInstance.get(`/v1/rent/user/booking/${bookingId}`)
        dispatch(setBookingDetails(response.data.data.bookings));
    }catch(error){
        console.error("Error fetching booking details",error)
    }
}

//fetch user bookings

export const fetchuserBookings = () => async (dispatch)=>{
    try{
        const response = await axiosInstance.get("/v1/rent/user/booking")
        dispatch(setBookings(response.data.data.bookings))
    }catch(error){
        console.error("Error fetching bookings", error)
    }
}