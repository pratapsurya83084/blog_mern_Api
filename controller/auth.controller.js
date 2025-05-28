import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

export const singnup = async (req, res, next) => {
  //get input
  const { username, email, password } = req.body;
  console.log("data receive:", username, email, password);

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
      return res.json({ message: "user already exists.", success: false });
    }

    //hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
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
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res) => {
  //take inpute email and password

  const { email, password } = req.body;
  //chekc empty or enter
  if (!email || !password || email === "" || password === "") {
    return res.json({ message: "please enter all fields", success: false });
  }
  //if enter then find email and password is exist in db
  try {
    const userExiste = await User.findOne({ email });

    if (userExiste) {
      //check then password is match
      const isMatch = await bcrypt.compare(password, userExiste.password);
      if (!isMatch) {
        return res.json({ message: "invalid password", success: false });
      } else {
        //if match then return token
        const token = jwt.sign({ userId: userExiste._id }, "&%$#!!(^@#@!", {
          expiresIn: "2d",
        });
        console.log(token);

        res.cookie("access_token", token, {
          httpOnly: true,
          maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          message: "login or signin successfull",
          success: true,
          token: token,
          user: userExiste,
        });
      }
    } else {
      return res.json({
        message: "invalid email or user not found",
        success: false,
      });
    }
  } catch (error) {
    res.json({ message: "" });
  }
};

dotenv.config();

export const google = async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    const genPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    if (!user) {
      user = new User({
        username: name,
        email,
        ProfilePicture: picture,
        password: bcrypt.hashSync(genPassword, 10),
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "&%$#!!(^@#@!",
      {
        expiresIn: "2d",
      }
    );

    // Set secure cookie
    res.cookie("googleToken", token, {
      httpOnly: true, // set to true for security
      secure: true, // must be true when using SameSite: "None"
      sameSite: "None", // required for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.username}`,
      token,
      user: {
        username: user.username,
        email: user.email,
        picture: user.ProfilePicture,
        userid: user._id,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({
      message: "Failed Google login",
      error: err.message,
      success: false,
    });
  }
};
