const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/user', UserController.getUserById);
router.post('/user/new-order', UserController.newOrder);

module.exports = router;