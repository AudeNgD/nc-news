const db = require("../db/connection");

//used for POST comment by Article id
//if author not user - reject
exports.checkAuthorExists = (author) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "unknown user" });
      }
    });
};
//used for POST comment by Article id
//if article id is not in articles db - reject
exports.checkArticleExists = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};