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
  describe("/api/articles/:article_id", () => {
    test("GET /api/articles/:article_id should return the relevant article and status 200", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          let count = 0;
          for (let key in body) {
            count += 1;
          }
          expect(count).toEqual(8);
          expect(typeof body.author).toBe("string");
          expect(typeof body.title).toBe("string");
          expect(typeof body.article_id).toBe("number");
          expect(typeof body.body).toBe("string");
          expect(typeof body.topic).toBe("string");
          expect(typeof body.created_at).toBe("string");
          expect(typeof body.votes).toBe("number");
          expect(typeof body.article_img_url).toBe("string");
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
});
