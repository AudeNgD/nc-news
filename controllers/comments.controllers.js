const { removeCommentById } = require("../models/comments.models");

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
