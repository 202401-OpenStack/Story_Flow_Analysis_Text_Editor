const express = require('express')
const app = express()
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const bodyParser = require('body-parser') // 폼 데이터 파싱
const path = require('path')
const authRoutes = require('./routes/auth')
const config = require('./config/config.json')
const sessionStore = new MySQLStore(config.database)

app.use(express.static(path.join(__dirname, 'client')))
app.use(bodyParser.urlencoded({extended: true})) // URL-encoded 데이터를 파싱할 수 있게 설정

app.use(session({ // 세션이 시작됨, 객체 전달
    name: 'session_cookie_name',
    secret: 'session_cookie_secret', // Required option(필수)
    resave: false, // 그냥 false
    saveUninitialized: true, // 세션이 필요한 경우에만 구동됨 (false로 하면 서버에 부담 줌)
    store: sessionStore,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000*60*60*24), // 24시간 이후 만료됨 1000*60*60*24
        maxAge: 1000 * 60 * 60 * 24 // 쿠키의 최대 나이를 24시간으로 설정
    }
}))

app.use('/', authRoutes)

app.get('/', function (req, res, next) {
    if(req.session && req.session.loggedIn) { // 로그인된 상태면 index.html을 보여줍니다.
        res.sendFile(path.join(__dirname, 'client', 'index.html'))
    } else { // 로그인되지 않았으면 auth.html을 보여줍니다.
        res.redirect('/auth')
    }
})


app.listen(3000, function(){
    console.log('3000!');
});