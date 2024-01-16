const db = require("../db/connection");

exports.fetchAllUsers = () => {
  let queryString = `
    SELECT * 
    FROM users
    `;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
