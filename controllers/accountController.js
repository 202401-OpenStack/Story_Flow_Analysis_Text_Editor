const { Account } = require('../models');
const bcrypt = require('bcrypt');

const saltRounds = 10; // 해시할 때의 salt 복잡도 결정 값. 보통 10~12 사용

// register
exports.register = async (req, res) => {
    try {

        // 클라이언트로부터 username, password 받아옴
        const { username, password } = req.body;

        // username 기준으로 기존 사용자 조회
        const existingUser = await Account.findOne({ where: { username: username } });

        // 이미 존재하는 username일 경우
        if (existingUser) {
            return res.status(409).json({ // 409 Conflict 상태 코드 사용
                message: 'Username is already taken'
            });
        }

        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 데이터베이스에 사용자 정보 저장
        const newUser = await Account.create({
            username,
            password: hashedPassword
        });

        // 성공했다면 201 응답 보냄
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: newUser.id,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering the user'
        });
    }
};

// login
exports.login = async (req, res) => {
    try {
        // 클라이언트로부터 username, password 요청받음
        const { username, password } = req.body;

        // username 기준으로 사용자 조회
        const user = await Account.findOne({ where: { username: username } });

        // username이 없을 때
        if (!user) {
            return res.status(401).json({ message: 'The username or password is incorrect' });
        }

        // username이 있을 때
        // 비밀번호 비교
        const match = await bcrypt.compare(password, user.password);

        // 같다면 로그인
        if (match) {
            req.session.username = user.username; // 세션에 username 저장
            req.session.accountId = user.id; // 세션에 id 저장
            console.log('User logged in:', username);
            // 비밀번호가 일치하면 사용자 ID를 세션에 저장
            return res.status(200).json({ 
                message: 'Logged in successfully', 
                data: {username: user.username}
            });
        } else {
            // 비밀번호 잘못 입력했을 때
            return res.status(401).json({ message: 'The username or password is incorrect' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({
            message: 'Error logining the user'
        });
    }
};

// logout
exports.logout = async (req, res) => {
    // 세션에 username이 저장돼있다면 (= 로그인된 상태라면) 삭제
    if (req.session.username) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({
                    message: 'Error during logout'
                });
            }
            // 삭제했다면 쿠키도 삭제
            res.clearCookie('session_cookie_name'); // express-session이 기본적으로 사용하는 쿠키 이름
            // 성공 응답 반환
            return res.status(200).json({
                message: 'Logged out successfully'
            });
        });
    } else {
        // 세션이 없다면 사용자는 이미 로그아웃 상태임
        return res.status(200).json({
            message: 'Already logged out'
        });
    }
};