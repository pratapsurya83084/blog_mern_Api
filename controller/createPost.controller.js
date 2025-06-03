import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const CreatePost = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message:
          "You are not an admin, so you are not allowed to create posts.",
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
        message:
          "A post with this slug already exists. Try changing the title.",
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
//for testing only
export const GetAllPost = async (req, res) => {
  const retriveAllpost = await Post.find();

  return res.json({
    message: "all post retrieve from DB",
    success: true,
    BlogPost: retriveAllpost,
  });
};

export const getposts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthago = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthago },
    });

    res.status(200).json({
      BlogPost: posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.error("posts fetching error ", error);
  }
};

export const DeletePost = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { userId: paramUserId, postId } = req.params;
    console.log(postId);

    // Authorization check
    if (!isAdmin || !userId || !paramUserId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    // Delete post by ID
    const deletedPost = await Post.findByIdAndDelete(postId.toString());

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.json({
      message: "Post deleted successfully",
      deletedPost,
      success: true,
    });
  } catch (error) {
    console.error("DeletePost Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



//UpdatePost
export const UpdatePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  if (!req.user.isAdmin || req.user.userId != userId) {
    return res.json({ message: "you are not allowed to update this post!" });
  }
    const { title, category, content } = req.body;
      if (!title || !content || !category) {
      return res.status(400).json({
        message: "All fields are must required are required.",
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
  try {
    const imageLocalFilePath = req.file?.path;
   console.log("localfile accesss :",imageLocalFilePath);

    // Upload to Cloudinary
    const imageurl = await uploadOnCloudinary(imageLocalFilePath);
    if (!imageurl) {
      return res.status(500).json({
        message: "Image upload failed , select new image",
        success: false,
      });
    }
   console.log("cloud url :",imageurl.url);
    
  
  
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: title,
          category: category,
          slug: slug,
          image: imageurl.url,
          content: content,
          userId: userId,
        },
      },
      { new: true }
    );

    if (updatedPost) {
      return res.json({
        message: "Post updated successfully",
        updatedPost,
        success: true,
      });
    } else {
      body;
      return res.status(404).json({
        message: "Post not found or upadate",
        success: false,
      });
    }
  } catch (error) {
    console.log("error for update post:", error);
  }
};
