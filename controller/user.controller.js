
import User from '../models/user.model.js'

export const singnup = async (req, res) => {
  //   res.json({
  //     message: "Here I have created signup API"
  //   });
};





export const updateUser = async (req, res, next) => {

const {username,email,password} = req.body;

if (!username || !email ||!password ||username==""||email==""||password=="") {
    return res.json({
        message: "Please fill all the fields",
        success: false
    })
}

if (password.length >20 || password.length< 6) {
    return res.json({
        message:"password must be between 6 to 20 ",
        success:false,
    })
}

  // console.log("requested user:",req.params.userId);
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({
      message: "user is not logged ! please try again",
      success: false,
    });
  } else {
    // here write user update logic

    const updateUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username,
        email,
        password 
      }
    },{new: true});
    return res.json({
      message: "user Updated SuccessFully",
      updateUser,
      success: true,
    });
  }
};
