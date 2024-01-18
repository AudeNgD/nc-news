const {
  removeCommentById,
  updateVoteByCommentId,
} = require("../models/comments.models");
const { checkCommentExists } = require("../utils/check-exists");
const { checkValidVoteReq } = require("../utils/check-valid");

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;

  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVoteByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return Promise.all([
    checkValidVoteReq(req.body),
    updateVoteByCommentId(comment_id, inc_votes),
    checkCommentExists(comment_id),
  ])
    .then((updatedComment) => {
      res.status(200).send({ updatedComment: updatedComment[1] });
    })
    .catch((err) => {
      next(err);
    });
};
