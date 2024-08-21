const express=require("express")
const cors=require("cors")
const dotenv=require('dotenv')
const path=require('path')
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const app=express()
const mongoose=require("mongoose")
const LoginModel=require("./schema")
const { otp, userLogin } = require("./otpverify")
const bcrypt = require('bcrypt');


// config is used to connecting port
dotenv.config({path:path.join(__dirname,"config",'config.env')})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:["https://clientauthentation.vercel.app/"],
  methods:["GET","POST"],
  credentials:true
}

))
//mongoDb Connection
mongoose.connect("mongodb+srv://rithaniravi:Rithani2095@clusterbackend.rpda541.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBackEnd")
      .then(()=>console.log("DB is connected"))
      .catch((err)=>{
        console.log("DB is not connected")
      })

//signin
app.post("/signin",async(req,res)=>{
    const {firstname,lastname,email,password}=req.body
    const user=await LoginModel.findOne({email})
    if(user){
      return res.json({message:"user already existed"})
    } 

    
//Password Hash
    const hashpassword= await bcrypt.hash(password,10)
    const newuser=new LoginModel ({firstname,lastname,email,password: hashpassword})
      await newuser.save()
      return res.json({valid:true,message:"record registered"})
      })

      
//after user verify authorized dashboard get 
app.get('/dashboard',(req,res)=>{
   return res.json({valid:true, message:"authorized"})
})

// Otp generation
app.post('/otpsend',otp)


// OTP verify and then to authorized user to login
app.post('/verifyotp',userLogin)

app.listen(process.env.PORT,()=>{
    console.log("server connected")
})

