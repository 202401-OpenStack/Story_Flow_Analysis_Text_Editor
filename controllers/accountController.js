const { Account } = require('../models'); // Sequelize 모델을 불러옵니다.
const bcrypt = require('bcrypt');

const saltRounds = 10; // 해시할 때의 salt 복잡도 결정 값. 보통 10~12 사용

// register
exports.register = async (req, res) => {
    try {
    const { username, password } = req.body;

    // 비밀번호를 해시합니다.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 정보를 데이터베이스에 저장합니다.
    const newUser = await Account.create({
        username,
        password: hashedPassword
    });

    res.status(201).send({
        message: 'User registered successfully',
        user: {
        id: newUser.id,
        username: newUser.username
        }
    });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send({
        message: 'Error registering the user'
    });
    }
};

// login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 사용자를 찾습니다.
        const user = await Account.findOne({ where: { username } }); // username을 기준으로 조회합니다.

        if (!user) {
            // 사용자가 데이터베이스에 없으면 실패 응답을 반환합니다.
            return res.status(401).json({ message: 'Login failed' });
        }

        // 비밀번호를 비교합니다.
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.username = user.username; // 세션에 username 저장
            req.session.accountId = user.id; // 세션에 id 저장
            console.log('User logged in:', username);
            // 비밀번호가 일치하면 사용자 ID를 세션에 저장합니다.
            return res.status(200).json({ message: 'Logged in successfully', username: user.username});
        } else {
            return res.status(401).json({ message: 'Login failed' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({
            message: 'Error logining the user'
        });
    }
};

// logout
exports.logout = (req, res) => {
    // 세션 정보가 존재하는지 확인합니다.
    if (req.session.username) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({
                    message: 'Error during logout'
                });
            }
            res.clearCookie('session_cookie_name'); // express-session이 기본적으로 사용하는 쿠키 이름
            return res.status(200).send({
                message: 'Logged out successfully'
            });
        });
    } else {
        // 세션이 없다면 사용자는 이미 로그아웃 상태입니다.
        return res.status(200).send({
            message: 'Already logged out'
        });
    }
};