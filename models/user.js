module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      // 유저 모델 정의
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // 모델 설정
      timestamps: true
    });
  
    return User;
  };