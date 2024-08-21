const nodemailer = require("nodemailer");
const {Email,Pass}=require("./config/mail")
const userotp=require("./userOtp")
const LoginModel=require('./schema')

// intalizing nodemailer for sending otp 
const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,
        pass: Pass
    }
})
// OTP generation
exports.otp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }
    try {
        const presuer = await LoginModel.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: Email,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:- ${OTP}`
                }


                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })

            } else {
            // save otp in Database
                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: Email,
                    to: email,
                    subject: "OTP for Eamil",
                    text: `OTP: ${OTP} Please Don't Share to anyone`
                }

                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};

// login - compare otp in db to email ID and generate token for authentation 
exports.userLogin = async (req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await LoginModel.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
            res.status(200).json({valid:true, message:`${email} Login Succesfully Done`,userToken:token,email:email});
            
           
            

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}