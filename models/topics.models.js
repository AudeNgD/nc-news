const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
  let queryString = ` SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    if (rows.length !== 0) {
      return rows;
    } else {
      Promise.reject({ status: 500, msg: "internal server error" });
    }
  });
};
