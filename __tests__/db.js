const fs = require('fs');
const path = require('path');
const db = require('../server/db/db');
const { query } = require('express');
import regeneratorRuntime from 'regenerator-runtime';

const usernames = [
  'franklysa',
  'jimmeyboysa',
  'billysa',
  'teddysonsa',
  'barneysona',
  'someotherguysona',
];
const topics = ['cool', 'nice', 'test', 'alright', 'yeah', 'woop'];
const subtopics = [
  'momma',
  'dadda',
  'big toe',
  'long grain rice',
  'shampoo',
  'brown eggs',
];
const randomizer = () => Math.floor(Math.random() * 6);
/**
 * Like many testing frameworks, in Jest we use the "describe" function to
 * separate our tests into sections. They make your test outputs readable.
 *
 * You can place "beforeAll", "beforeEach", "afterAll", and "afterEach"
 * functions inside of "describe" blocks and they will only run for tests
 * inside that describe block. You can even nest describes within describes!
 */
describe('db unit tests', () => {
  /**
   * Jest runs the "beforeAll" function once, before any tests are executed.
   * Here, we write to the file and then reset our database model. Then, we
   * invoke the "done" callback to tell Jest our async operations have
   * completed. This way, the tests won't start until the "database" has been
   * reset to an empty Array!
   */

  // beforeAll((done) => {
  //   done();
  // });

  // afterAll((done) => {
  //   // Closing the DB connection allows Jest to exit successfully.
  //   //db.connection.close();
  //   done();
  // });

  describe('#sync', () => {
    const user = usernames[randomizer()];
    const topic = topics[randomizer()];
    const subtopic = subtopics[randomizer()];
    it('db user GET test is working', async () => {
      try {
        const sqlQuery = `SELECT * FROM Users`;

        const result = await db.query(sqlQuery, []);
        console.log("Here's the type of all users", typeof result);
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });

    // TODO: Finish unit testing the sync function
    // ADDED:
    //- unit tests for all other tables GET (topics, subtopics, )
    it('db topic GET test is working', async () => {
      try {
        const sqlQuery = 'SELECT * FROM Topics';

        const result = await db.query(sqlQuery, []);
        console.log("Here's the type of all topics: ", typeof result);
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });

    it('db subtopic GET test is working', async () => {
      try {
        const sqlQuery = 'SELECT * FROM Subtopics';
        const result = await db.query(sqlQuery, []);
        console.log("Here's the type of all subtopics: ", typeof result);
        expect(typeof result).toEqual('object');
      } catch (e) {
        console.log(e);
      }
    });

    // requires a unique username for each test :/
    // xit('db user POST test is working', async () => {
    //   const sqlQuery =
    //     'INSERT INTO Users (username, email, token) VALUES($1,$2, $3)'; /*ON CONFLICT (username) DO UPDATESET token = EXCLUDED.token'*/
    //   const result = await db.query(sqlQuery, [user, 'password', '123456']);
    //   console.log("Here's the typeof this post request", typeof result);
    //   expect(typeof result).toBe('object');
    // });

    it('db user POST / DELETE test is working', async () => {
      try {
        const sqlQueryAdd = `INSERT INTO Users (username, email, token) VALUES($1, $2, $3)`;
        const sqlQueryDelete = `DELETE FROM Users WHERE username='${user}'`;
        const result = await db
          .query(sqlQueryAdd, [user, `${user}@gmail.com`, '123456'])
          .then(await db.query(sqlQueryDelete, []));
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });

    // db topis post / delete test
    it('db topic POST / DELETE test is working', async () => {
      try {
        const sqlQueryAddTopic = `INSERT INTO topics (topic_name, username) VALUES ($1, $2) RETURNING *`;
        const sqlQueryDeleteTopic = `DELETE FROM topics WHERE topic_name=$1`;
        const result = await db
          .query(sqlQueryAddTopic, [topic, 'test'])
          .then(await db.query(sqlQueryDeleteTopic, [topic]));
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });

    // db subtopic post / delete test
    it('db subtopic POST / DELETE test is working', async () => {
      try {
        const sqlQueryAddSubtopic = `INSERT INTO subtopics (topic_id, title) VALUES($1, $2)`;
        const sqlQueryDeleteSubtopic = `DELETE from subtopics WHERE title=$1`;
        const result = await db
          .query(sqlQueryAddSubtopic, [41, subtopic])
          .then(await db.query(sqlQueryDeleteSubtopic, [subtopic]));
        console.log(result);
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });

    // db PUT test
    it('db subtopic PUT test is working', async () => {
      try {
        const sqlQueryPutSubopic =
          'UPDATE subtopics SET text=$1 WHERE title=$2';
        const result = await db.query(sqlQueryPutSubopic, [
          `testing put ${user}`,
          'test',
        ]);
        expect(typeof result).toBe('object');
      } catch (e) {
        console.log(e);
      }
    });
  });
});
