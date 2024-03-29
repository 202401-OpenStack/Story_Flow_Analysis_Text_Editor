const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; 
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델들을 여기에 추가
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;
