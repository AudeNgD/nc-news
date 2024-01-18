const db = require("../db/connection");

//used for POST comment by Article id
//if author not user - reject
exports.checkAuthorExists = (author) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
    });
};
//used for POST comment by Article id and PATCH vote by article id
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

//used for DELETE comment by comment_id
//used for PATCH comment votes by comment_id
exports.checkCommentExists = (commentId) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [commentId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

//used for GET article(s) by topic
exports.checkTopicExists = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug=$1", [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
};

//used for GET user by username
exports.checkUsernameExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};
