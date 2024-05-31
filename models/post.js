'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.Account, {
        foreignKey: 'accountId',
        as: 'author',
        onDelete: 'CASCADE'
      });
      Post.hasMany(models.Photo, {
        foreignKey: 'postId',
        as: 'photos',
        onDelete: 'CASCADE'
      });
    };
  };
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    accountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};