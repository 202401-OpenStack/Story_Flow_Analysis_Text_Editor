const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 요약하기
router.post('/summarize', analysisController.summarizeArticle);

// 주제 찾기
router.post('/topic', analysisController.findTopic);

module.exports = router;