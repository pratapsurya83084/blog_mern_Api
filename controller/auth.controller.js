import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

export const singnup = async (req, res,next) => {
  //get input
  const { username, email, password } = req.body;
console.log("data receive:",username,email,password);

if (
    !email ||
    !username ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(404).json({ message: "all fields are required" });
  }

 try {
     const CheckUserExist = await User.findOne({ email });
     if (CheckUserExist) {
       return res.json({ message: "user already exists.",success:false });

    }
   
     //hash password
     const hashedPassword =  bcrypt.hashSync(password, 10);
     const newUser = new User({
       username,
       email,
       password: hashedPassword, //hashed password store in DB
     });
     const user = await newUser.save();
     if (user) {
       res.json({
         message: "User created SuccessFully",
         user: req.body,
         success:true
       });
     }
   
 } catch (error) {
      next(error)
  
 }




};
