//user Schema

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto"
import { settings } from "node:cluster";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter your name"],
            // '           jhon         '=>'jhon'
            trim:true,
            maxlength:[50, "your name cannot be longer than 50 charecters"]
        },
        email:{
            type:String,
            required:[true,"please enter your email ID"],
            unique:true,
            lowercase:true,
            trim:true,
            validate: [validator.isEmail,"please enter valid email address"]
        },
        password:{
            type:String,
            required:[true,"please enter your password"],
            minlength:[6,"your password must be longer than 6 charecters"],
            select:false
        },
        passwordConfirm :{
            type:String,
            required:[true,"please confirm your password"],
            validator:{
                validator:function(el){
                    return el === this.password
                },
                message:"passwords are not the same !"
            }
        },
        phoneNumber:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        role:{
            type:String,
            enum:["user", "admin"],
            default:"user"
        },
        avatar:{
            url:{type:String},
            public_id:{type:String}
        },
        passwordChangedAt:{
            type:Date
        },
        passwordResetToken:{
            type:String, 
            select:false,
            index:true
        },
        passwordResetExpires:{
            type:Date,
            select:false,
        },
    },
    {timestamps:true}
)

//settings to not pass in response from server
userSchema.set("tojson",{
    transform:function(doc,ret){
        delete ret.password;
        delete ret.passswordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})

//passord logic
//Hashing
userSchema.pre("save",async function(){
    if(!this.isModified("password"))return ;

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
})

//login check
//test123 === e32tr2yut36rgdw6r536r537
userSchema.methods.correctPassword = async function(candidatepassword,userpassword){
    return await bcrypt.compare(candidatepassword,userpassword)
}

//
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000,
            10
        );
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//forget password
userSchema.methods.createpasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() +10 *60 *1000;
    return resetToken;
}


const User = mongoose.model("User", userSchema);
//in mongodb : users
 export{User};
