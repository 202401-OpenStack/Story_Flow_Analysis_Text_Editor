exports.checkAuth = (req, res) => {
    if (req.session.username) {
      return res.status(200).json({ authenticated: true, username: req.session.username });
    } else {
      return res.status(200).json({ authenticated: false });
    }
};

