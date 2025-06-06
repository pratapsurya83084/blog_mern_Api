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

      if (!postComment || postComment.length === 0) {
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

//LikeComment
export const LikeComment = async (req, res) => {
  const commentId = req.params.commentId;
  console.log("Received comment ID:", commentId);

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    const userId = req.user.userId;
    const userLikeIndex = comment.likes.indexOf(userId);

    if (userLikeIndex === -1) {
      // Not liked yet, add like
      comment.likes.push(userId);
      comment.numberOfLikes += 1;
    } else {
      // Already liked, remove like
      comment.likes.splice(userLikeIndex, 1);
      comment.numberOfLikes = Math.max(0, comment.numberOfLikes - 1); // prevent negative
    }

    await comment.save();

    // ✅ Send updated comment info back to client
    return res.status(200).json({
      message: "Like status updated",
      success: true,
      comment: {
        _id: comment._id,
        likes: comment.likes,
        numberOfLikes: comment.numberOfLikes,
      },
    });

  } catch (error) {
    console.error("Error while toggling like:", error);
    return res.status(500).json({
      message: "Server error while updating like",
      success: false,
    });
  }
};

