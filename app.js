const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndPoints } = require("./controllers/core.controllers");
const {
  getArticleById,
  getArticles,
  postCommentByArticleId,
  patchVoteByArticleId,
} = require("./controllers/articles.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

app.use(express.json());

//CORE method
app.get("/api", getEndPoints);

//TOPICS methods
app.get("/api/topics", getTopics);

//ARTICLES methods
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticleById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchVoteByArticleId);

//COMMENTS methods
app.delete("/api/comments/:comment_id", deleteCommentById);

//USERS methods
app.get("/api/users", getAllUsers);

//invalid syntax in SQL query
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

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
