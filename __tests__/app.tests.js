const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endPointsInfo = require("../endpoints.json");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("app", () => {
  describe("/api/topics", () => {
    test("GET /api/topics should return a list of all the topics and status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
  });
  describe("/api/articles", () => {
    test("GET /api/articles should return an array of article objects with correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toEqual(13);
          body.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
        });
    });
    test("by default the articles are sorted by date in ascending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSorted({ key: "created_at", descending: true });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET /api/articles/:article_id should return the relevant article and status 200", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.article).length).toEqual(8);
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.article_id).toBe(1);
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.topic).toBe("mitch");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(body.article.votes).toBe(100);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("400 - GET /api/articles/:article_id should return not found if invalid id", () => {
      return request(app)
        .get("/api/articles/nonsense")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404 - GET /api/articles/:article_id should return not found if valid id but not in table", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
        });
    });
    test("PATCH /api/articles/1 should return article with updated vote value - increment case", () => {
      const votePatch = { inc_votes: 7 };
      return request(app)
        .patch("/api/articles/1")
        .send(votePatch)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual(
            expect.objectContaining({
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 107,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });
    test("PATCH /api/articles/1 should return article with updated vote value - decrement case", () => {
      const votePatch = { inc_votes: -30 };
      return request(app)
        .patch("/api/articles/1")
        .send(votePatch)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual(
            expect.objectContaining({
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 70,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });
    test("404 - PATCH /api/articles/9999 should return not found if valid id put not in table", () => {
      const votePatch = { inc_votes: -30 };
      return request(app)
        .patch("/api/articles/9999")
        .send(votePatch)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("article not found");
        });
    });
    test("400 - PATCH /api/articles/nonsense should return not found if invalid id", () => {
      const votePatch = { inc_votes: -30 };
      return request(app)
        .patch("/api/articles/nonsense")
        .send(votePatch)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("POST /api/articles/1/comments", () => {
      const newComment = {
        body: "test comment",
        author: "icellusedkars",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual("test comment");
        });
    });
    test("400 - author is not a user", () => {
      const newComment = {
        body: "test comment",
        author: "test author",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("unknown user");
        });
    });
    test("404 - article id does not exist in articles db", () => {
      const newComment = {
        body: "test comment 2",
        author: "icellusedkars",
      };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("article not found");
        });
    });
  });
  describe("/api", () => {
    test("Incorrect url sends back 404 path not found", () => {
      return request(app)
        .get("/api/nonsense")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("URL not found");
        });
    });
    test("GET /api should return an object describing all the available endpoints and status 200", () => {
      return (
        request(app)
          .get("/api")
          .expect(200)
          //or body.endPoints
          .then(({ body: { endPoints } }) => {
            expect(endPoints).toEqual(endPointsInfo);
          })
      );
    });
  });
  // describe("/api/comments/:comment_id", () => {
  //   test("DELETE /api/comments/1 deletes the specified comment and sends no body back", () => {
  //     return request(app).delete("/api/comments/1").expect(204);
  //   });
  // });
});
