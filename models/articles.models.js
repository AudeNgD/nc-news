const format = require("pg-format");
const db = require("../db/connection");
const {
  checkAuthorExists,
  checkArticleExists,
} = require("../utils/check-exists");
const { checkValidReq } = require("../utils/check-valid");

exports.fetchArticleById = (artId) => {
  let queryString = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments on comments.article_id=articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(queryString, [artId]).then(({ rows }) => {
    //if valid id but not in table
    if (rows.length === 0) {
      return Promise.reject();
    }

    return rows[0];
  });
};

exports.fetchAllArticles = (topic) => {
  let queryString = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id
  `;
  let queryParams = [];

  if (topic) {
    queryString += `WHERE topic=$1`;
    queryParams.push(topic);
  }

  queryString += `GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(queryString, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.addCommentByArticleId = (articleId, { body, author }) => {
  //do the checks -> author is user, article id exists in db
  return Promise.all([
    checkAuthorExists(author),
    checkArticleExists(articleId),
  ]).then(() => {
    let queryString = `INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;`;
    let queryParams = [body, author, articleId];
    return db.query(queryString, queryParams).then(({ rows }) => {
      return rows[0].body;
    });
  });
};

exports.updateVoteByArticleId = (articleId, incrVote) => {
  //do the check -> article id exists in db
  return Promise.all([checkArticleExists(articleId)]).then(() => {
    let queryString = `UPDATE articles
    SET votes=votes+$1
    WHERE article_id=$2
    RETURNING *`;

    let queryParams = [incrVote, articleId];
    return db.query(queryString, queryParams).then(({ rows }) => {
      return rows[0];
    });
  });
};
