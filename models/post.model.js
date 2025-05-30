import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://venngage-wordpress.s3.amazonaws.com/uploads/2020/10/Anatomy-of-the-Perfect-Blog-Post.png"
    },
    category: {
      type: String,
      required: true,
      default: "uncategorized"
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
