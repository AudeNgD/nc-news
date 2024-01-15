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
