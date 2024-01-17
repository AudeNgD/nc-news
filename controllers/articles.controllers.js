const {
  fetchArticleById,
  fetchAllArticles,
  addCommentByArticleId,
  updateVoteByArticleId,
} = require("../models/articles.models");
const { checkTopicExists } = require("../utils/check-exists");
const { checkValidCommentReq } = require("../utils/check-valid");

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
  const topic = req.query.topic;

  const queries = [fetchAllArticles(topic)];

  if (topic) {
    queries.push(checkTopicExists(topic));
  }
  return Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const newComment = req.body;
  const articleId = req.params.article_id;

  return Promise.all([
    checkValidCommentReq(newComment),
    addCommentByArticleId(articleId, newComment),
  ])
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
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
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
