const fs = require("fs/promises");

exports.getEndPoints = (req, res, next) => {
  return fs
    .readFile(
      "/home/aude/northcoders/back-end/be-nc-news/endpoints.json",
      "utf-8"
    )
    .then((data) => {
      return data;
    })
    .then((data) => {
      res.status(200).send({ data });
    });
};
