const db = require("../db/connection");

exports.fetchTopics = () => {
  let queryString = ` SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = ({ slug, description }) => {
  let insertString = `INSERT INTO topics
  (slug, description)
  VALUES 
  ($1, $2)
 RETURNING *
 `;
  let queryParams = [slug, description];

  return db.query(insertString, queryParams).then(({ rows }) => {
    return rows[0];
  });
};
