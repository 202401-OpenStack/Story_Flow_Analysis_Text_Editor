const express = require('express')
const app = express()
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const bodyParser = require('body-parser') // 폼 데이터 파싱
const path = require('path')

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'story_flow_analysis_text_editor'
}

const sessionStore = new MySQLStore(options)

app.use(express.static(path.join(__dirname, 'client')))

app.use(session({ // 세션이 시작됨, 객체 전달
    name: 'session_cookie_name',
    secret: 'session_cookie_secret', // Required option(필수)
    resave: false, // 그냥 false
    saveUninitialized: true, // 세션이 필요한 경우에만 구동됨 (false로 하면 서버에 부담 줌)
    store: sessionStore,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000*60*60*24), // 24시간 이후 만료됨 1000*60*60*24
        maxAge: 1000 * 60
    }
}))



app.get('/', function (req, res, next) {
    console.log(req.session) // 객체 추가
    res.sendFile(path.join(__dirname, 'client', 'auth.html'))
    if(req.session.num === undefined) { // 저장이 기본적으로는 메모리에 됨 -> 휘발성임
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1
    }
    //res.send(`Views : ${req.session.num} `)
})



app.listen(3000, function(){
    console.log('3000!');
});