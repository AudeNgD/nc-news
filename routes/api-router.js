const apiRouter = require("express").Router();

const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const coreRouter = require("./core-router");
const commentsRouter = require("./comments-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("", coreRouter);

module.exports = apiRouter;
