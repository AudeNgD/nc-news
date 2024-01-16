const format = require("pg-format");
const db = require("../db/connection");

exports.fetchArticleById = (artId) => {
  let queryString = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryString, [artId]).then(({ rows }) => {
    //if valid id but not in table
    if (rows.length === 0) {
      return Promise.reject();
    }
    return rows[0];
  });
};

exports.fetchAllArticles = () => {
  let queryString = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC
  `;
  return db.query(queryString).then(({ rows }) => {
    console.log(rows, "<<here in model");
    return rows;
  });
};
