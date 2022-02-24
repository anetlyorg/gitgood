const express = require('express');

const sessionController = require('../controllers/sessionController');
const topicController = require('../controllers/topicController');
const subtopicController = require('../controllers/subtopicController');

const router = express.Router();

// TOPIC - CRUD routes
router.get('/topic',
  sessionController.isLoggedIn,
  topicController.getTopics,
  (req, res) => res.status(200).json(res.locals)
);

router.post('/topic/',
  sessionController.isLoggedIn,
  topicController.postTopic,
  (req, res) => res.status(200).json(res.locals.topic)
);

router.delete('/topic/:id/:order',
  sessionController.isLoggedIn,
  topicController.deleteTopic,
  (req, res) => res.status(200).json(res.locals.topic)
);

router.put('/topic/newOrder/:order',
  sessionController.isLoggedIn,
  topicController.newTopicsOrder,
  (req, res) => res.status(200).json(res.locals.topic)
);

// SUBTOPIC - CRUD routes
router.get('/subtopic/:topic_id',
  sessionController.isLoggedIn,
  subtopicController.getSubtopics,
  (req, res) => res.status(200).json(res.locals.subtopics)
);

router.post('/subtopic/',
  sessionController.isLoggedIn,
  subtopicController.postSubtopic,
  (req, res) => res.status(200).json(res.locals.subtopic)
);

router.delete('/subtopic/:id/:order',
  sessionController.isLoggedIn,
  subtopicController.deleteSubtopic,
  (req, res) => res.status(200).json(res.locals.subtopic)
);

router.put('/subtopic/',
  sessionController.isLoggedIn,
  subtopicController.putSubtopic,
  (req, res) => res.status(200).json(res.locals.subtopic)
);

router.put('/subtopic/newOrderOne/:id/:order',
  sessionController.isLoggedIn,
  subtopicController.newOrderOne,
  (req, res) => res.status(200).json(res.locals.topic)
);

module.exports = router;
