const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.PGDATABASE_URL) {
  throw new Error("PGDATABASE or PGDATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.PGDATABASE_URL;
  config.max = 2;
}

module.exports = new Pool();
