// 필요한 미들웨어 임포트
const express = require('express');
const path = require('path');
const {sequelize} = require('./models');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// 라우터 임포트
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const analysisRoutes = require('./routes/analysisController');

// app 설정
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// CORS 설정: 배포 환경에서는 삭제
// 모든 접근 허용
const cors = require('cors');
app.use(cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  }));

// session 스토어 설정
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dbConfig = require('./config/config.json').development;

const options = {
  host: dbConfig.host,
  port: 3306,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  checkExpirationInterval: 60000,
  expiration: 1000 * 60 * 60 * 24 // 세션 만료: 24시간
};

const sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000*60*60*24 // 쿠키 만료: 24시간
  }
}));

// PORT 설정
const PORT = process.env.PORT || 3001;

// 데이터베이스 연결 확인
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// 라우터 설정
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/analysis', analysisRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  return res.send("development server: GitHub Action Test");
});

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}.`));