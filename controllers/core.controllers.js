const fs = require("fs/promises");
const file = require("../endpoints.json");
//console.log(file);

exports.getEndPoints = (req, res, next) => {
  res.status(200).send({ endPoints: file });
  // return fs
  //   .readFile("../endpoints.json", "utf-8")

  //   .then((data) => {
  //     res.status(200).send({ endPoints: JSON.parse(data) });
  //   });
};
