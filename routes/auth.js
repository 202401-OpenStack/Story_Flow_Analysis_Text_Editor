const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path')

router.get('/auth', authController.getAuthPage);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
