'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('genders', [
    {
      key : 'M', value : 'Male', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'F', value: 'Female', createdAt: new Date(), updatedAt: new Date()
    }, 
    {
      key: 'O', value: 'Others', createdAt: new Date(), updatedAt: new Date()
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('genders', null, {});
  }
};
