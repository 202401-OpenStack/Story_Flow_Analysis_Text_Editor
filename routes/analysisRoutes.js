const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 요약하기
router.post('/summarize', analysisController.summarizeArticle);

// 주제 찾기
router.post('/topic', analysisController.findTopic);

// 키워드 추출
router.post('/keywords', analysisController.extractKeywords);

// 인물수 분석
router.post('/character-count', analysisController.analyzeCharacterCount);

// 타임라인 분석
router.post('/timeline', analysisController.analyzeTimeline);

// 인물 관계 분석
router.post('/character-relationships', analysisController.analyzeCharacterRelationships);

// 이야기 흐름 판단
router.post('/story-flow', analysisController.judgeStoryFlow);

module.exports = router;