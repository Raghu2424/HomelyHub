import slugify from 'slugify';
import mongoose from 'mongoose';
import { User } from './userModel.js';

const normalizeAmenityName = (value) => {
    const names = {
        wifi: "wifi",
        kitchen: "kitchen",
        ac: "Ac",
        tv: "Tv",
        pool: "Pool",
        "free parking": "Free parking",
        "washing machine": "washing machine",
    };

    return names[String(value).trim().toLowerCase()] || value;
};

const propertySchema = new mongoose.Schema({
    propertyName:{
        type: String,
        required:[true,"please enter your property name"]
    },
    description:{
        type: String,
        required:[true,"please add information about your property"]
    },

    extraInfo:{
        type:String,
        default:"checkin on time. good services."
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House", "Hotel"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },

    maximumGuest:{
        type:Number,
        required:[true,"please give the maximum no of Guest that can oocupy"]
    },
    amenities:[
        {
            name:{
                type:String,
                required:true,
                set: normalizeAmenityName,
                enum:[
                    "wifi",
                    "kitchen",
                    "Ac",
                    "washing machine",
                    "Tv",
                    "Pool",
                    "Free parking"
                ]
            },
            icon:{
                type:String,
                required:true
            }
        }
    ],
    images:{
        type:[
            {
                public_id:{
                    type:String
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        validate:{
            validator:function(arr){
                return arr.length >=6;
            },
            message:"The images must contain atleast 6 images"
        }
    },
    price:{
        type:Number,
        required:[true,"please enter the price per night value"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number
    },
    //will add this soon
    currentBookings:{

    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index: true
    },

    slug:String,
    checkInTime:{type:String,default:"11:00"},
    checkOutTime:{type:String,default:"13:00"}
})

const Property = mongoose.models.property || mongoose.model("property", propertySchema);
const property = Property;

export { Property, property };
