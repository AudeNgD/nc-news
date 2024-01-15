const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
  let queryString = ` SELECT * FROM topics`;
  return db.query(queryString).then((topics) => {
    return topics.rows;
  });
};
