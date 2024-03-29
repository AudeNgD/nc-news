const db = require("../db/connection");
const {
  checkAuthorExists,
  checkArticleExists,
  checkTopicExists,
  checkArticleInCommentsTable,
} = require("../utils/check-exists");
const { checkValidReq, checkValidNewArticle } = require("../utils/check-valid");

exports.fetchArticleById = (artId) => {
  let queryString = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments on comments.article_id=articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(queryString, [artId]).then(({ rows }) => {
    //if valid id but not in table
    if (rows.length === 0) {
      return Promise.reject();
    }

    return rows[0];
  });
};

exports.fetchAllArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = "10",
  p = "1"
) => {
  const validSortBy = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrderBy = ["asc", "desc", "ASC", "DESC"];

  if (!validSortBy.includes(sort_by) || !validOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  //check valid limit and valid page number
  if (isNaN(limit) !== false || isNaN(p) !== false) {
    return Promise.reject({ status: 400, msg: "Bad query" });
  }

  let selectQueryString = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id
  `;

  let selectQueryParams = [];

  if (topic) {
    selectQueryString += `WHERE topic=$1`;
    selectQueryParams.push(topic);
  }
  selectQueryString += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(selectQueryString, selectQueryParams).then(({ rows }) => {
    const rowCount = rows.length;
    const responseSize = Number(limit);
    const offset = Number(limit) * (Number(p) - 1);

    if (offset > rowCount) {
      return Promise.reject({ status: 404, msg: "Page not found" });
    }
    rows = rows.slice(offset, offset + responseSize);

    return [rows, rowCount];
  });
};

exports.fetchCommentsByArticleId = (articleId) => {
  //do the checks
  return Promise.all([checkArticleExists(articleId)]).then(() => {
    let queryString = `SELECT * FROM comments
  WHERE article_id=$1`;

    return db.query(queryString, [articleId]).then(({ rows }) => {
      return rows;
    });
  });
};

exports.addCommentByArticleId = (articleId, { body, author }) => {
  //do the checks -> author is user, article id exists in db
  return Promise.all([
    checkAuthorExists(author),
    checkArticleExists(articleId),
  ]).then(() => {
    let queryString = `INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;`;
    let queryParams = [body, author, articleId];
    return db.query(queryString, queryParams).then(({ rows }) => {
      return rows[0].body;
    });
  });
};

exports.updateVoteByArticleId = (articleId, incrVote) => {
  //do the check -> article id exists in db
  return Promise.all([checkArticleExists(articleId)]).then(() => {
    let queryString = `UPDATE articles
    SET votes=votes+$1
    WHERE article_id=$2
    RETURNING *`;

    let queryParams = [incrVote, articleId];
    return db.query(queryString, queryParams).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.addNewArticle = ({ author, title, body, topic, article_img_url }) => {
  //do the checks -> author is user and topic is an existing one

  return Promise.all([checkAuthorExists(author), checkTopicExists(topic)]).then(
    () => {
      if (article_img_url === undefined) {
        article_img_url =
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
      }

      let insertString = `INSERT INTO articles
      (author, title, body, topic, article_img_url)
      VALUES 
      ($1, $2, $3, $4, $5)
     RETURNING *
     `;

      let queryParams = [author, title, body, topic, article_img_url];
      return db.query(insertString, queryParams).then(({ rows }) => {
        const article_id = rows[0].article_id;

        let selectQuery = `SELECT articles.article_id, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id=articles.article_id 
    WHERE articles.article_id=$1
    GROUP BY articles.article_id`;

        return db.query(selectQuery, [article_id]).then(({ rows }) => {
          return rows[0];
        });
      });
    }
  );
};

exports.removeArticleByArticleId = (article_id) => {
  //if article_id exists in comments table remove the comments
  return Promise.all([checkArticleInCommentsTable(article_id)]).then((res) => {
    if (res[0] !== 0) {
      let deleteCommentsQuery = `DELETE FROM comments WHERE article_id=$1`;
      let deleteCommentsParams = [article_id];
      return db.query(deleteCommentsQuery, deleteCommentsParams);
    }
    //do the check -> article id exists in db
    return Promise.all([checkArticleExists(article_id)]).then(() => {
      let queryString = `DELETE FROM articles
            WHERE article_id=$1
            `;

      let queryParams = [article_id];
      return db.query(queryString, queryParams);
    });
  });
};
