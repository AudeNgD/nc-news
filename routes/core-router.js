const coreRouter = require("express").Router();

const { getEndPoints } = require("../controllers/core.controllers");

coreRouter.get("/", getEndPoints);

module.exports = coreRouter;
