const apiRouter = require("./routes/api-router");

const express = require("express");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);

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
