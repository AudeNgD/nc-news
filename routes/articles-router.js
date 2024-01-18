const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  postCommentByArticleId,
  patchVoteByArticleId,
} = require("../controllers/articles.controllers");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:id", getArticleById);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

articlesRouter.patch("/:article_id", patchVoteByArticleId);

module.exports = articlesRouter;
