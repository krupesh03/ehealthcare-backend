'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      mobile_number: {
        allowNull: true,
        type: Sequelize.BIGINT,
        unique: true
      },
      user_type: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        comment: "1 for admin, 2 for doctor, 3 for patient"
      },
      blood_group: {
        allowNull: true,
        type: Sequelize.TEXT('tiny')
      },
      is_admin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      qualification: {
        allowNull: true,
        type: Sequelize.INTEGER,
        comment: "Only for doctors"
      },
      doc_category: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING(1000)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};