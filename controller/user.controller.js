import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
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
  return  res.json({
    message: "you are not allowed to delete user",
    success: false,

  })
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
