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

exports.updateVoteByCommentId = (comment_id, inc_votes) => {
  let queryString = `UPDATE comments
    SET votes=votes+$1
    WHERE comment_id=$2
    RETURNING *`;

  let queryParams = [inc_votes, comment_id];
  return db.query(queryString, queryParams).then(({ rows }) => {
    return rows[0];
  });
};
