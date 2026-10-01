import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

//fetch details of one specific property using it's id

//receive the property id 
//start loading
//call backend api
//wait for response
//get the property data
//store details in redux
//if error store error in redux

export const getPropertyDetails =(id) => async(dispatch) =>{
    try{
        dispatch(propertyDetailsAction.getlistrequest());
        const response = await axiosInstance.get(`/v1/rent/listing/${id}`)
        console.log(response);
        if(!response){
            throw new Error("Could not fetch any propertyDetails")
        }

        const{data} = response.data;
        dispatch(propertyDetailsAction.getpropertyDetails(data))
    }catch(error){
        dispatch(
            propertyDetailsAction.getErrors(
                error.response?.data?.error || error.message
            )
        );

    }
}
