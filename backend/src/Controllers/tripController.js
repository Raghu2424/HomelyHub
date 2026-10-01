//recv the users information
//validate the required information
// Send the information to out AI trip planner
// Calculate the budget per night
// Search Mongodb for suitable properties
// Send both A trip plan + matching properties back to the frontend / user

import { property } from "../Models/propertyModel.js"
import { planTrip } from "../ai/tripPlanner.js"
import { generateDescription } from "../ai/generateDescription.js"

const cleanCity = (text) => text.toLowerCase().replaceAll(" ","")

const cretaeTripPlan = async(req,res) =>{
    try{
        const {destination, budget, days, people, interests} = req.body

        if(!destination || !budget || !days || !people){
            return res.status(400).json({
                status:"fail",
                message:"Please fill in destination, budget, days, and people"
            })
        }

        const plan = await planTrip({
            destination, 
            budget, 
            days, 
            people, 
            interests : interests || {}
        });

        const pernNight = Number(budget)/Number(days);

        const city = cleanCity(destination);

        const properties = await property.find({
            $or:[
                {"address.city": city},
                {"address.state": city},
                {"address.area": city}
            ],
            price:{$lte: pernNight},
            maximumGuest:{$gte: Number(people)},
        }).limit(6);

        res.status(200).json({
            status:"success",
            data:{plan, properties, pernNight }
        })

    }catch(error){
        res.status(500).json({
            status:"fail",
            message:"Could not create trip plan, please try again"
        })
    }
}


const writeDescription = async(req,res)=>{
     try{
         const { propertyName, propertyType, roomType, maximumGuest, address } = req.body;

         if (!propertyName || !propertyType || !roomType || !maximumGuest || !address) {
             return res.status(400).json({
                 status: "fail",
                 message: "Please provide the property title, type, room type, guests, and address",
             });
         }

         const description = await generateDescription(req.body);

    res.status(200).json({status:"success", data:{description}})
    
   }catch(error){
        console.error("Description generation failed:", error);
    res.status(500).json({
            status:"fail",
                        message: error.message || "Could not generate a description"
        })
   }
}
export {cretaeTripPlan, writeDescription};