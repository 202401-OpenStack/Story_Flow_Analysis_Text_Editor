'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Accounts', [{
      username: 'testname',
      password: '$2b$10$VGaPU6eEocJY7xRdMmlQHuUi2c2JG2TYThyRONnBRbIz0nYOvpeoe', // 해시값
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
   
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
