const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");

//TOPICS methods
app.get("/api/topics", getTopics);

//invalid url - don't move this at the top of the app.js file
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "URL not found" });
});

module.exports = app;
