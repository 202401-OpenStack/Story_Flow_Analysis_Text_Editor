const path = require('path');
const {User} = require('../models');
const bcrypt = require('bcryptjs');

const getAuthPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'auth.html'));
};

const signup = async (req, res) => {
    const { newUsername, newPassword, confirmPassword } = req.body;
    
    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    if (newPassword !== confirmPassword) {
        return res.status(400).send('비밀번호가 일치하지 않습니다.');
    }
    
    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // 사용자 생성
        const newUser = await User.create({
            username: newUsername,
            password: hashedPassword
        });
        
        // 회원가입 성공, 로그인 페이지로 리다이렉트
        res.redirect('/auth.html');
    } catch (error) {
        console.error('회원가입 처리 중 에러 발생:', error);
        res.send('회원가입 중 에러가 발생했습니다.');
    }
};

const login = async (req, res) => {
    const { id, password } = req.body; // 폼에서 입력된 아이디와 비밀번호
    try {
        const user = await User.findOne({ where: { username: id } }); // 변수명 변경: User -> user
        if (!user) {
            // 사용자가 없는 경우
            return res.redirect('/auth');
        }
        // 비밀번호 검증 (여기서는 해시된 비밀번호 비교를 가정)
        const match = await bcrypt.compare(password, user.password); // 변수명 변경 반영: User -> user
        if (match) {
            req.session.loggedIn = true; // 세션에 로그인 상태를 저장
            return res.redirect('/'); // 로그인에 성공하면 루트로 리다이렉트하여 index.html을 보여줍니다.
        } else {
            // 비밀번호가 일치하지 않는 경우
            return res.redirect('/auth');
        }
    } catch (err) {
        console.error('로그인 처리 중 에러 발생:', err);
        return res.redirect('/auth');
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

const session_test = (req, res) => {
    if (req.session.loggedIn) {
        res.json({loggedIn: true});
    } else {
        res.json({loggedIn: false});
    }
}

module.exports = {
    getAuthPage,
    signup,
    login,
    logout,
    session_test
};
