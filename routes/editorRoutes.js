const express = require('express');
const router = express.Router();
const { renderEditorPage } = require('../controllers/editorController');
const { checkLoggedIn } = require('../middleware/authMiddleware');

router.get('/editor.html', checkLoggedIn, renderEditorPage);

module.exports = router;
