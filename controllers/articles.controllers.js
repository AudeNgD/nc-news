const { response } = require("../app");
const {
  fetchArticleById,
  fetchAllArticles,
  addCommentByArticleId,
  updateVoteByArticleId,
  addNewArticle,
  removeArticleByArticleId,
  fetchCommentsByArticleId,
} = require("../models/articles.models");
const { checkTopicExists } = require("../utils/check-exists");
const {
  checkValidCommentReq,
  checkValidNewArticle,
} = require("../utils/check-valid");

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
  const { topic, sort_by, order, limit, p } = req.query;
  const queries = [fetchAllArticles(topic, sort_by, order, limit, p)];

  if (topic) {
    queries.push(checkTopicExists(topic));
  }
  return Promise.all(queries)
    .then((response) => {
      const articles = response[0][0];
      let total_count = response[0][1];

      //may return empty array as valid response if topic is valid but not in db
      // if (
      //   articles[0] !== undefined &&
      //   articles[0].hasOwnProperty("total_count")
      // ) {
      //   total_count = articles[0].total_count;
      //   total_count = Number(total_count);
      //   articles.forEach((article) => delete article.total_count);
      // }
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchCommentsByArticleId(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
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

exports.postNewArticle = (req, res, next) => {
  const newArticleData = req.body;
  return Promise.all([
    checkValidNewArticle(newArticleData),
    addNewArticle(newArticleData),
  ])
    .then((newArticle) => {
      res.status(201).send({ newArticle: newArticle[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  removeArticleByArticleId(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
