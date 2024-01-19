const db = require("../db/connection");

exports.getRowsCount = (table_name, topic) => {
  const validTableName = ["articles", "users", "comments", "topics"];

  if (validTableName.includes(table_name)) {
    let queryString = `SELECT COUNT(*) FROM ${table_name}`;
    let queryParams = [];

    if (topic) {
      queryString += `WHERE topic=$1`;
      queryParams.push(topic);
    }
  }

  return db.query(queryString, queryParams).then(({ rows }) => {
    console.log(rows, "here");
    return rows;
  });
};
