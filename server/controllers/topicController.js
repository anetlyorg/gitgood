const db = require('../db/db');

const topicController = {};

topicController.getTopics = (req, res, next) => {
  const username = res.locals.username;
  const sqlQuery = 'SELECT * FROM topics WHERE username = $1';
  const userGetQuery = 'SELECT topics_order FROM users WHERE username = $1';
  const subtopicQuery = 'SELECT * from subtopics WHERE users_username = $1';

  db.query(sqlQuery, [username])
    .then((payload) => {
      const result = {};
      payload.rows.forEach((curr) => {
        result[curr._id] = curr.topic_name;
      });
      res.locals.topics = result;
      db.query(userGetQuery, [username])
        .then((userPayload) => {
          console.log('payload 2', userPayload.rows[0].topics_order);
          res.locals.topicsOrder = userPayload.rows[0].topics_order;
          console.log('locals', res.locals);
          db.query(subtopicQuery, [username])
            .then((subtopicPayload) => {
              console.log('subtopics', subtopicPayload.rows);
              const subtopics = {};
              subtopicPayload.rows.forEach((sub) => {
                subtopics[sub._id] = sub;
              });
              res.locals.subtopics = subtopics;
              return next();
            });
        });
    })
    .catch((err) => {
      return next({
        log: `topicController.getTopics: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in topicController.getTopics. Check server log for more details.',
        },
      });
    });
};

topicController.postTopic = (req, res, next) => {
  const username = res.locals.username;
  const { topic_name } = req.body;
  console.log('incoming', req.body, username);

  const sqlQuery =
    'INSERT INTO topics (username, topic_name, subtopics_order) VALUES ($1, $2, ARRAY[]::integer[]) RETURNING *';

  const userPostQuery = 'UPDATE users SET topics_order = topics_order || ARRAY[$2]::integer[] WHERE username = $1 RETURNING *';

  db.query(sqlQuery, [username, topic_name])
    .then((payload) => {
      res.locals.topic = payload.rows[0];
      console.log('payload 1', typeof payload.rows[0]._id);
      db.query(userPostQuery, [username, payload.rows[0]._id])
        .then((userPayload) => {
          console.log('payload 2', userPayload.rows[0]);
          res.locals.topicOrder = userPayload.rows[0].topic_order;
          return next();
        });
    })
    .catch((err) => {
      return next({
        log: `topicController.postTopics: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in topicController.postTopics. Check server log for more details.',
        },
      });
    });
};

topicController.deleteTopic = (req, res, next) => {
  const username = res.locals.username;
  let { id, order } = req.params;
  console.log('delete', username, id, typeof order);
  order = JSON.parse(order);
  console.log(typeof order, typeof order[0]);
  console.log('delete', username, id, order);
  const sqlQuery = 'DELETE FROM topics WHERE _id=$1 RETURNING *';

  const userDelQuery = 'UPDATE users SET topics_order = $2::integer[] WHERE username = $1 RETURNING *';

  db.query(sqlQuery, [id])
    .then((payload) => {
      res.locals.topic = payload.rows[0];
      console.log('payload 1', payload.rows[0]);
      db.query(userDelQuery, [username, order])
        .then((userPayload) => {
          console.log('payload 2', userPayload.rows[0]);
          // check next line - was singular, changed to plural
          res.locals.topicsOrder = userPayload.rows[0].topics_order;
          return next();
        });
    })
    .catch((err) => {
      return next({
        log: `topicController.deleteTopics: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in topicController.deleteTopics. Check server log for more details.',
        },
      });
    });
};

module.exports = topicController;
