import bcrypt from "bcryptjs";
import User from "../models/User.js";
import transporter from "../middlewares/sendMail.js";

const generateOtp = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp(); 
        const otpExpiry = Date.now() + 10 * 60 * 1000; 

        await transporter.sendMail({
            from: `"WatchStore"<jyantithakor941@gmail.com>`,
            to: email,
            subject: "Account Verification Code",
            html: ` <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; }
                    .header { background: #1a1a1a; padding: 30px; text-align: center; }
                    .header h1 { color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
                    .content { padding: 40px; text-align: center; line-height: 1.6; }
                    .otp-box { background: #f9f9f9; border: 2px dashed #d4af37; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a; margin: 20px 0; }
                    .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Chronos & Co.</h1></div>
                    <div class="content">
                        <h2>Verification Code</h2>
                        <p>Welcome to the world of timeless elegance. Use the code below to verify your account:</p>
                        <div class="otp-box">${otp}</div>
                        <p>This code expires in 10 minutes.</p>
                    </div>
                    <div class="footer">&copy; 2024 Chronos & Co. Luxury Watch Store</div>
                </div>
            </body>
            </html>` // Fixed interpolation
        });

        await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry
        });

        res.status(201).json({ message: "OTP sent to your email." });
    } catch (err) {
        console.error(err); // Good practice to log the actual error
        res.status(500).json({ message: "Internal server error.", error: err.message });
    }
};



export const verifyOtp = async(req,res)=>{
    try{
        const {email,otp} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message:"User is not found.!!"})
        }

        if(user.otp !== otp){
             return res.status(401).json({message:"Invalid otp"})
        }

        if(user.verified){
            return res.status(401).json({message:"User is already verified."})
        }

        if(user.otpExpiry < Date.now()){
            return res.status(401).json({message:"Otp is Expired.!!"})
        }

        user.otp = null;
        user.isVerified = true;
        user.otpExpiry = null;

        await user.save();

        return res.status(201).json({message:"User register successfully.!"})

    }
    catch(err){
       res.status(501).json({message:"Internal server error.",err}); 
    }
}

export const getRegister = (req,res)=>{
    res.render('register')
}

export const getLogin = (req,res)=>{
    res.render('login')
}