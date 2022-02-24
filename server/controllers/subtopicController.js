const db = require('../db/db');

const subtopicController = {};

subtopicController.getSubtopics = (req, res, next) => {
  const { topic_id } = req.params;

  const sqlQuery = 'SELECT * FROM subtopics WHERE topic_id=$1';

  db.query(sqlQuery, [topic_id])
    .then((payload) => {
      // res.locals.subtopics = payload.rows;
      next();
    })
    .catch((err) => {
      return next({
        log: `subtopicController.getSubtopics: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in subtopicController.getSubtopics. Check server log for more details.',
        },
      });
    });
};

subtopicController.postSubtopic = (req, res, next) => {
  let { topic_id, emoji, title, text, progress } = req.body;
  console.log('topic id', topic_id);
  //Set default values for empty subtopic fields
  emoji = emoji || '';
  title = title || 'Title Holder';
  text = text || '';
  progress = progress || 0;

  const sqlQuery = `INSERT INTO subtopics (topic_id, emoji, title, text, progress) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const topicQuery = 'UPDATE topics SET subtopics_order = subtopics_order || ARRAY[$2]::integer[] WHERE _id = $1 RETURNING *';

  db.query(sqlQuery, [topic_id, emoji, title, text, progress])
    .then((payload) => {
      res.locals.subtopic = payload.rows[0];
      db.query(topicQuery, [topic_id, payload.rows[0]._id])
        .then((topicPayload) => {
          console.log('payload 2', topicPayload.rows[0]);
          res.locals.subtopicsOrder = topicPayload.rows[0].subtopics_order;
          return next();
        });
    })
    .catch((err) => {
      return next({
        log: `subtopicController.postSubtopic: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in subtopicController.postSubtopic. Check server log for more details.',
        },
      });
    });
};

subtopicController.deleteSubtopic = (req, res, next) => {
  const { id, order } = req.params;
  const parsedOrder = JSON.parse(order);

  const sqlQuery = 'DELETE FROM subtopics WHERE _id=$1 RETURNING *';

  const topicDelQuery = 'UPDATE topics SET subtopics_order = $2::integer[] WHERE _id = $1 RETURNING *';

  db.query(sqlQuery, [id])
    .then((payload) => {
      res.locals.subtopic = payload.rows[0];
      console.log('payload 1', payload.rows[0]);
      db.query(topicDelQuery, [payload.rows[0]._id, parsedOrder])
        .then((topicPayload) => {
          console.log('payload 2', topicPayload.rows[0]);
          // check next line - was singular, changed to plural
          res.locals.subtopicsOrder = topicPayload.rows[0].subtopics_order;
          return next();
        });
    })
    .catch((err) => {
      return next({
        log: `subtopicController.deleteSubtopic: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in subtopicController.deleteSubtopic. Check server log for more details.',
        },
      });
    });
};

subtopicController.putSubtopic = (req, res, next) => {
  let { emoji, title, text, progress, _id } = req.body;

  //Set default values for empty subtopic fields
  emoji = emoji || '';
  title = title || 'Title Holder';
  text = text || '';
  progress = progress || 0;

  const sqlQuery =
    'UPDATE subtopics SET emoji=$1, title=$2, text=$3, progress=$4 WHERE _id=$5 RETURNING *';

  db.query(sqlQuery, [emoji, title, text, progress, _id])
    .then((payload) => {
      res.locals.subtopic = payload.rows[0];
      next();
    })
    .catch((err) => {
      return next({
        log: `subtopicController.putSubtopic: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in subtopicController.putSubtopic. Check server log for more details.',
        },
      });
    });
};

subtopicController.newOrderOne = (req, res, next) => {
  const { id, order } = req.params;
  const parsedOrder = JSON.parse(order);
      
  const sqlQuery = 'UPDATE topics SET subtopics_order = $2::integer[] WHERE _id = $1 RETURNING *';
    
  db.query(sqlQuery, [id, parsedOrder])
    .then((topicPayload) => {
      console.log('payload 2', topicPayload.rows[0]);
      // check next line - was singular, changed to plural
      res.locals.subtopicsOrder = topicPayload.rows[0].subtopics_order;
      return next();
    })
    .catch((err) => {
      return next({
        log: `subtopicController.newOrderOne: ERROR: ${
          typeof err === 'object' ? JSON.stringify(err) : err
        }`,
        message: {
          err: 'Error occurred in subtopicController.newOrderOne. Check server log for more details.',
        },
      });
    });
};

module.exports = subtopicController;
