const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/logout', accountController.logout); // post인 이유: 서버의 상태를 바꾸기 때문 (세션 파괴)

module.exports = router;