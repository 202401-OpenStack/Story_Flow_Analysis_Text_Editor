const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 요약하기
router.get('/summarize', analysisController.summarizeArticle);

// 주제 찾기
router.get('/topic', analysisController.findTopic);

module.exports = router;