import mongoose from "mongoose";
import { type } from "os";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      required: true,
    },

    ProfilePicture:{
      type:String,
      default:"https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
    }

  },
  
  { timestamps: true }

);

const User = mongoose.model("User", UserSchema);
export default User;
