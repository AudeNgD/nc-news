# Northcoders News

## This project
I built the backend service for a social media news service similar to reddit, where a user can post articles relating to a topic.
Other users can comment and leave votes too.
This backend is built using Node.js, Express.js and PostgresSQL.
Test Driven Development managed by using Jest and Supertest.

## Instructions
1. Fork and clone this repo `https://github.com/AudeNgD/nc-news`
 
2. In your local repo, install the dependencies by running `npm i`

3. Create a .env.test and .env.development files in the root folder of your local repo.
In the .env.test file, add `PGDATABASE=nc_news_test`
In the .env.development file, add `PGDATABASE=nc_news`
NB - The db names should match the names listed in the /db/setup.sql file

4. Check that the .env files are .gitignored

5. Seed the local databases by running `run setup-dbs` and `run seed`. The latter will seed the db with the development data.

6. Run the tests by running `npm test app` to check that all is in order.

## Minimum version requirements
- PostgreSQL > 14.11
- Node.js > 21.3.0

## Link to the hosted version
https://nc-news-uld9.onrender.com/
