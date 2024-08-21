const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")

// schema for user registation
const LoginSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
   })
//token generation for new user
LoginSchema.methods.generateAuthtoken = async function() {
    try {
        let newtoken = jwt.sign({_id:this._id},process.env.KEY,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    } catch (error) {
        res.status(400).json(error)
    }
}
const LoginModel=mongoose.model("Login",LoginSchema);
module.exports=LoginModel;