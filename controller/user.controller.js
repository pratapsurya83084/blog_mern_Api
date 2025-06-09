import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const singnup = async (req, res) => {
  //for testing
  //   res.json({
  //     message: "Here I have created signup API"
  //   });
};

export const updateUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username == "" ||
    email == "" ||
    password == ""
  ) {
    return res.json({
      message: "Please fill all the fields",
      success: false,
    });
  }

  // if (password.length > 20 || password.length < 6) {
  //   return res.json({
  //     message: "password must be between 6 to 20 length",
  //     success: false,
  //   });
  // }

  // console.log("requested user:",req.params.userId);
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({
      message: "user is not logged ! please try again",
      success: false,
    });
  } else {
    // here write user update logic

    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          email: email,
          password: bcrypt.hashSync(password, 10),
        },
      },
      { new: true }
    );
    return res.json({
      message: "user Updated SuccessFully",
      user: updateUser,
      success: true,
    });
  }
};

//deleteUser

export const DeleteUser = async (req, res) => {
  const userId = req.params.userId;
  console.log("params id:", userId);

  const middlewareUserId = req.user.userId;
  console.log("middlewared id: " + middlewareUserId);

  if (userId !== middlewareUserId) {
    return res.json({
      message: "user cannot delete account",
      success: false,
    });
  }

  const delteUserAccount = await User.findByIdAndDelete({ _id: userId });
  if (delteUserAccount) {
    return res.json({
      message: "user deleted successfully",
      success: true,
    });
  } else {
    return res.json({
      message: "user not found",
      success: false,
    });
  }
};

//GetUsers all
export const GetUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.json({
      message: "you are not allowed to retrieve All users",
      success: false,
    });
  }

  const usersAll = await User.find();
  if (usersAll) {
    return res.json({
      message: "users retrieved successfully",
      success: true,
      users: usersAll,
    });
  } else {
    return res.json({
      message: "users not found",
      success: false,
    });
  }
};

export const DeleteUserByAdmin = async (req, res) => {
  const userId = req.params.userId;
  console.log("params id:", userId);

  if (!req.user.isAdmin) {
    return res.json({
      message: "you are not allowed to delete user",
      success: false,
    });
  }

  try {
    const delteUserAccount = await User.findByIdAndDelete({ _id: userId });

    if (delteUserAccount) {
      return res.json({
        message: "user deleted successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "user not found",
        success: false,
      });
    }
  } catch (error) {
    console.log("error create for delete user:", error);
  }
};

//getUser
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "User retrieve success",
      user: rest,
    });
  } catch (error) {
    console.log("Error getting user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving user",
    });
  }
};

//SendMail
const checkWithEmailVerificationAPI = async (email) => {
  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );

    const data = response.data;
    console.log(data);

    return data.deliverability === "DELIVERABLE";
  } catch (error) {
    console.error(
      "Email verification failed:",
      error?.response?.data?.error || error.message
    );
    return false;
  }
};

export const SendMail = async (req, res) => {
  const { email } = req.body;
  // console.log(process.env.GMAIL_PASS  , "  "  , process.env.GMAIL_USER);

  // Check if it's a valid Gmail address
  if (!email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid Gmail address.",
    });
  }
  const isValidEmail = await checkWithEmailVerificationAPI(email);
  if (!isValidEmail) {
    return res.status(400).json({
      success: false,
      message: "That email doesn't seem to exist or accept mail.",
    });
  }
  try {
    // Create mail transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App password if 2FA is on
      },
    });

    const mailOptions = {
      from: `"Pratap Blogs" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Pratap Blogs!",
      html: `
        <h1>Welcome to Pratap Blogs</h1>
        <p>Thanks for subscribing to <a href="https://pratapblogs.netlify.app">pratapblogs.netlify.app</a>.</p>
        <p>Stay tuned for awesome content and updates!</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(result);

    return res.json({
      success: true,
      message: "Welcome email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    const isInvalidAddress =
      error.response && error.response.includes("550 5.1.1");

    return res.status(500).json({
      success: false,
      message: isInvalidAddress
        ? "Email address not found. Please check the email and try again."
        : "Failed to send email. Please try again later.",
    });
  }
};
