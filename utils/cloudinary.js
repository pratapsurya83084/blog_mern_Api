import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

//step.1 config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRETE_KEY,
});

//upload file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file after upload success then access short url
    // console.log("file is uploaded on cloudinary", response.url); //after uploaded cloudinary provide short url
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the file from server if failed uploaded file
  return null;
  }
};

export {uploadOnCloudinary}
