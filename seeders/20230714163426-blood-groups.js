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
   await queryInterface.bulkInsert('bloodgroups', [
    {
      key: 'A+', value: 'A+', createdAt: new Date(), updatedAt: new Date()
    }, 
    {
      key: 'A-', value: 'A-', createdAt: new Date(), updatedAt: new Date()
    }, 
    {
      key: 'B+', value: 'B+', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'B-', value: 'B-', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'O+', value: 'O+', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'O-', value: 'O-', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'AB+', value: 'AB+', createdAt: new Date(), updatedAt: new Date()
    },
    {
      key: 'AB-', value: 'AB-', createdAt: new Date(), updatedAt: new Date()
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
    await queryInterface.bulkDelete('bloodgroups', null, {});
  }
};
