const {
  fetchArticleById,
  fetchAllArticles,
  addCommentByArticleId,
  updateVoteByArticleId,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const artId = req.params.id;

  fetchArticleById(artId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const newComment = req.body;
  const articleId = req.params.article_id;

  addCommentByArticleId(articleId, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVoteByArticleId = (req, res, next) => {
  const incrVote = req.body.inc_votes;
  const articleId = req.params.article_id;
  updateVoteByArticleId(articleId, incrVote)
    .then((updatedArticle) => {
      console.log(updatedArticle, "<<here controller");
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
