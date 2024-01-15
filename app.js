const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/core.controllers");

//CORE method
app.get("/api", getEndPoints);

//TOPICS methods
app.get("/api/topics", getTopics);

//CUSTOM errors
app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//invalid url - don't move this at the top of the app.js file
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "URL not found" });
});

//last resort error handling
app.use((err, req, res, next) => {
  res.status();
});

module.exports = app;
