const mongoose=require("mongoose")

// schema for login 
const userOtpSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true, 
    },
    otp:{
        type:String,
        require:true
    }
})
const userotp=new mongoose.model("userotps",userOtpSchema)
module.exports=userotp