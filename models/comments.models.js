const db = require("../db/connection");
const { checkCommentExists } = require("../utils/check-exists");

exports.removeCommentById = (commentId) => {
  //do the check -> comment id exists in db
  return Promise.all([checkCommentExists(commentId)]).then(() => {
    let queryString = `DELETE FROM comments
        WHERE comment_id=$1
        `;

    let queryParams = [commentId];
    return db.query(queryString, queryParams);
  });
};
