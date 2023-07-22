'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');
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
    await queryInterface.bulkInsert('users', [{
      first_name: 'Super',
      last_name: 'Admin',
      email: 'super.admin@test.com',
      password: await bcrypt.hash('#admin@2023#', 10),
      mobile_number: '7894561230',
      gender: 'M',
      user_type: 1,
      blood_group: 'O+',
      is_admin: 1,
      qualification: null,
      doc_category: null,
      address: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
