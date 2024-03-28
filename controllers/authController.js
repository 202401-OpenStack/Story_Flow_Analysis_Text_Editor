const user = require('../user');
const path = require('path')

const getAuthPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'auth.html'));
};

const login = (req, res) => {
    const { id, password } = req.body; // 폼에서 입력된 아이디와 비밀번호
    // 입력된 아이디와 비밀번호가 user 객체와 일치하는지 확인
    console.log(id, password);
    if (id === user.id && password === user.password) {
        req.session.loggedIn = true; // 세션에 로그인 상태를 저장
        res.redirect('/'); // 로그인에 성공하면 루트로 리다이렉트하여 index.html을 보여줍니다.
    } else {
        res.redirect('/auth');
    }
};

const logout = (req, res) => {
    if (req.session) {
        // 세션을 파괴하고 로그아웃 처리
        req.session.destroy((err) => {
            if (err) {
                console.error('세션 파괴 중 에러 발생:', err);
            }
            res.clearCookie('session_cookie_name');
            res.redirect('/auth'); // 세션 파괴 후 로그인 페이지로 리다이렉트
        });
    }
    if (!req.session) {
        console.log("세션이 삭제되었습니다.")
    }
};

module.exports = {
    getAuthPage,
    login,
    logout
};
