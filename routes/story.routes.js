const express = require('express');
const router = express.Router();
const StoryController = require('../controllers/story.controller');

router.get('/story', StoryController.getAll);
router.get('/story/:id', StoryController.getById);

module.exports = router;