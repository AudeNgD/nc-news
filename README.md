# Northcoders News API

THIS PROJECT
Created a hosted service similar to reddit, where a user can post articles with associated topic.
Other users can comment and leave votes.

INSTALLATION
Clone down the repo locally.

SET-UP
-> Create .env.test and .env.development files. Into each, add PGDATABASE name for that environment.
The names are listed in the /db/setup.sql file.
Check that the .env files are .gitignored

At this point you'll need to run npm install

-> Seed the local databases by running run setup-dbs and run seed

-> Install the following dev dependencies
husky
jest-extended
jest-sorted
pg-format
supertest

-> Other dependencies
dotenv
express
pg
postgres

-> Run the tests by running
npm test app

-> You'll need postgres > 3.4.3 and Node.js > 21.3.0

LINK TO HOSTED VERSION
https://nc-news-uld9.onrender.com/
