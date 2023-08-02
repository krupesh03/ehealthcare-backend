'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'birth_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      after: 'mobile_number'
    });
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: 'birth_date'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'birth_date');
    await queryInterface.removeColumn('users', 'age');
  }
};
