import Post from '../models/post.model.js'

export const CreatePost = async (req, res) => {
  console.log(req.user.isAdmin);
  if (!req.user.isAdmin) {
    return res.json({
      message: "You are not an admin , your are not allow to craete Post",
      success: true,
    });
  }

  const userId = req.user.userId; //blog created userId

  if (!req.body.title || !req.body.content) {
    return res.json({
      message: "all fields are must be required",
      success: false,
    });
  }

 const slug = req.body.title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except space and hyphen
  .replace(/\s+/g, "-")         // Replace spaces with hyphens
  .replace(/-+/g, "-");         // Replace multiple hyphens with one


  const newPostblog = new Post({ ...req.body, slug, userId });

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
