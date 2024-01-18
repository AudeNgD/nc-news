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

exports.fetchUserByUsername = (username) => {
  //do the check -> username exists in db

  let queryString = `
  SELECT * 
  FROM users
  WHERE username=$1
  `;

  //let queryParams = [username];
  return db.query(queryString, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    }
    return rows[0];
  });
};
