'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.hasMany(models.Post, {
        foreignKey: 'accountId',
        as: 'posts', // Account 인스턴스에서 Post 데이터를 가져올 때 사용할 이름
        onDelete: 'CASCADE' // 계정이 삭제되면 해당 계정의 글도 모두 삭제된다.
      });
    }
  }
  Account.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};