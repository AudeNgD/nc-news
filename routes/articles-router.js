const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  postCommentByArticleId,
  patchVoteByArticleId,
  postNewArticle,
  deleteArticleByArticleId,
} = require("../controllers/articles.controllers");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postNewArticle);

articlesRouter.get("/:id", getArticleById);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

articlesRouter.patch("/:article_id", patchVoteByArticleId);
articlesRouter.delete("/:article_id", deleteArticleByArticleId);

module.exports = articlesRouter;
