import Post from '../models/post.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js';


export const CreatePost = async (req, res) => {
  console.log(req.user.isAdmin);
  if (!req.user.isAdmin) {
    return res.json({
      message: "You are not an admin , your are not allow to craete Post",
      success: true,
    });
  }

  const userId = req.user.userId; //blog created userId
 
  const {title,content ,image,category} = req.body;

  if (!title || !content) {
    return res.json({
      message: "title and content are must be required",
      success: false,
    });
  }

 const slug = title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except space and hyphen
  .replace(/\s+/g, "-")         // Replace spaces with hyphens
  .replace(/-+/g, "-");         // Replace multiple hyphens with one

//check image is exist in local directory public
const imageLocalFilePath = req.files?.image[0].path;
if (!imageLocalFilePath) {
  return res.json({
    message: "Please upload an image",
    success: false,
  })
}
//upload image to cloudinary
const imageurl = await uploadOnCloudinary(imageLocalFilePath);
// console.log("cloudinary image url:",imageurl);

if (!imageurl) {
  return res.json({
    message: "Failed to upload image to cloudinary",
    success: false,
  })
}


const newPostblog = new Post({ title,content ,image:imageurl.url,category, slug, userId });

  try {
    const savePost  = await newPostblog.save();
    if (savePost) {
   
      return res.json({
        savePost,
        message: "Blog created successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Blog not created",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
