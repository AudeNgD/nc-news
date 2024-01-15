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
    // test("GET /api/topics should return status 500 in case of server error", () => {
    //   return request(app)
    //     .get("/api/topic")
    //     .expect(500)
    //     .then(({ body }) => {
    //       expect(body.msg).toBe("internal server error");
    //     });
    // });
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
      return request(app)
        .get("/api")
        .expect(200)
        .then((object) => {
          expect(object.toString()).toEqual(endPointsInfo.toString());
        });
    });
  });
});
