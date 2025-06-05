import Comment from "../models/comment.model.js";

export const CreateComment = async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;
    //     console.log("userID: ",userId, "Middel userId: ", req.user.userId);
    // console.log("postId :",postId);
    // console.log("comment: ",comment);
    if (!comment || !postId || !userId) {
      return res.json({
        status: false,
        message: "Please fill all fields",
      });
    }

    if (userId != req.user.userId) {
      return res.json({
        message: "You are not authorized to create a comment",
        status: 401,
        success: false,
      });
    }
    const newComment = new Comment({
      postId: postId,
      userId: userId,
      comment: comment,
    });
    await newComment.save();
    if (newComment) {
      res.json({
        status: true,
        message: "Comment created successfully",
        success: true,
      });
    } else {
      res.json({
        status: false,
        message: "Comment not created",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Error creating comment",
      success: false,
    });
  }
};

//GetPostComment
export const GetPostComment = async (req, res) => {
  const postId = req.params.postId;
  // console.log("the postid is received in backend :", postId);

  try {
    if (postId) {
      const postComment = await Comment.find({ postId }).sort({
        createdAt: -1,
      });
      // console.log(postComment);

      if (!postComment ||  postComment.length === 0) {
        return res.json({
          success: false,
          message: "Post comment not found",
        });
      } else {
        return res.json({
       
          message: "Post comment found",
          success: true,
          comment: postComment,
        });
      }
    } else {
      return res.json({
        status: false,
        message: "Post id not found",
      });
    }
  } catch (error) {
    console.log("error while fetching comment :", error);
  }
};
