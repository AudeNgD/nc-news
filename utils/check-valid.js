//check validity of request for POST comment by article id

exports.checkValidCommentReq = ({ body, author }) => {
  if (body === undefined || author === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
};