require('dotenv').config(); // .env 파일의 내용을 환경 변수로 로드

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD, // .env 파일의 DB_PASSWORD 변수 사용
    database: "story_flow_analysis_text_editor",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD || null, // .env 파일의 DB_PASSWORD 변수 사용
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD || null, // .env 파일의 DB_PASSWORD 변수 사용
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql"
  }
};