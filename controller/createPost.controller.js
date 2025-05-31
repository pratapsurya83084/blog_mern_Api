import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const CreatePost = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "You are not an admin, so you are not allowed to create posts.",
        success: false,
      });
    }

    const userId = req.user.userId;
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
        success: false,
      });
    }

    // Create slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Check image
    const imageLocalFilePath = req.file?.path;
    if (!imageLocalFilePath) {
      return res.status(400).json({
        message: "Please upload an image.",
        success: false,
      });
    }

    // Upload to Cloudinary
    const imageurl = await uploadOnCloudinary(imageLocalFilePath);
    if (!imageurl) {
      return res.status(500).json({
        message: "Image upload to Cloudinary failed.",
        success: false,
      });
    }

    // Save post to DB
    const newPostblog = new Post({
      title,
      content,
      image: imageurl.url,
      category,
      slug,
      userId,
    });

    const savePost = await newPostblog.save();

    return res.status(201).json({
      savePost,
      message: "Blog created successfully",
      success: true,
    });

  } catch (error) {
    // Catch duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.json({
        success: false,
        message: "A post with this slug already exists. Try changing the title.",
      });
    }

    console.error("Error in creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the blog.",
      error: error.message,
    });
  }
};


export const GetAllPost = async (req, res) => {
  const retriveAllpost = await Post.find();

  return res.json({
    message: "all post retrieve from DB",
    success: true,
    BlogPost: retriveAllpost,
  });
};
