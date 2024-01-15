const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const artId = req.params.id;

  fetchArticleById(artId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
