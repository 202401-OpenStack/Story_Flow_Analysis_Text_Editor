const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');

router.get('/auth', authController.getAuthPage);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/session-test', authController.session_test);

module.exports = router;
