const commentsRouter = require("express").Router();

const {
  deleteCommentById,
  patchVoteByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchVoteByCommentId);

module.exports = commentsRouter;
