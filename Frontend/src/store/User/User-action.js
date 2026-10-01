import {userActions} from "./User-slice";
import { axiosInstance } from "../../utils/axios";

const getErrorMessage = (error) =>
    error.response?.data?.message ||
    "The server is unavailable. Please check the backend and database connection.";

//signup
export const getSignup = (user) => async(dispatch)=>{
    try{
        dispatch(userActions.getSignupRequest());
        const {data} = await axiosInstance.post("/v1/rent/user/signup",user);
        dispatch(userActions.getsignupDetails(data.user))
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
}

//login
export const getLogin=(user)=> async(dispatch) =>{
    try{
        dispatch(userActions.getLoginRequest());
        const{data} = await axiosInstance.post("/v1/rent/user/login",user);
        dispatch(userActions.getLoginDetails(data.user))
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
}

export const currentUser =() => async(dispatch)=>{
    try{
        dispatch(userActions.getCurrentRequest());
        const{data} = await axiosInstance.get("/v1/rent/user/me");
        dispatch(userActions.getCurrentUser(data.user))
    }catch{
        dispatch(userActions.getLogout(null));
    }
}

export const updateUser = (updateUser)=> async(dispatch)=>{
    try{
        dispatch(userActions.getUpdateUserRequest());
        const { data } = await axiosInstance.patch("/v1/rent/user/updateme", updateUser);
        dispatch(userActions.getCurrentUser(data.data.user));
        return true;
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
        return false;
    }
}

export const forgotPassword =(email)=>async(dispatch)=>{
    try{
        await axiosInstance.post("/v1/rent/user/forgotPassword",{email})
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
}

export const resetPassword = (repassword, token)=> async(dispatch)=>{
    try{
        await axiosInstance.patch(`/v1/rent/user/resetPassword/${token}`,repassword)
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
}

export const updatePassword = (Password)=> async(dispatch)=>{
    try{
        dispatch(userActions.getPasswordReuest());
        await axiosInstance.patch("/v1/rent/user/updateMyPassword",Password)
        dispatch(userActions.getPasswordSuccess(true))

    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
}

export const logout =()=> async(dispatch)=>{
    try{
        await axiosInstance.get("/v1/rent/user/logout")
        dispatch(userActions.getLogout(null));
    }catch(error){
        dispatch(userActions.getError(getErrorMessage(error)))
    }
};