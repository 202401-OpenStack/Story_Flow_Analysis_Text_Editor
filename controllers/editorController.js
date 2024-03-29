const path = require('path');

const renderEditorPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'editor.html'));
};

module.exports = {
    renderEditorPage
};