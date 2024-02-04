const { fetchTopics, addTopic } = require("../models/topics.models");
const { checkValidNewTopic } = require("../utils/check-valid");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const newTopicData = req.body;
  return Promise.all([checkValidNewTopic(newTopicData), addTopic(newTopicData)])
    .then((new_topic) => {
      res.status(201).send({ new_topic: new_topic[1] });
    })
    .catch((err) => {
      next(err);
    });
};
