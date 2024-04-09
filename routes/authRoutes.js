const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 로그인 상태를 확인하는 라우트
router.get('/check', authController.checkAuth);

module.exports = router;