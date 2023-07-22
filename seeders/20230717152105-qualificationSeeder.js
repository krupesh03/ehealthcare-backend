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
    await queryInterface.bulkInsert('qualifications', [
      { key: 'MBBS', value: 'Bachelor of Medicine, Bachelor of Surgery', createdAt: new Date(), updatedAt: new Date() },
      { key: 'BDS', value: 'Bachelor of Dental Surgery', createdAt: new Date(), updatedAt: new Date() },
      { key: 'BAMS', value: 'Bachelor of Ayurvedic Medicine and Surgery', createdAt: new Date(), updatedAt: new Date() },
      { key: 'BUMS', value: 'Bachelor of Unani Medicine and Surgery', createdAt: new Date(), updatedAt: new Date() },
      { key: 'BHMS', value: 'Bachelor of Homeopathy Medicine and Surgery', createdAt: new Date(), updatedAt: new Date() },
      { key: 'BYNS', value: 'Bachelor of Yoga and Naturopathy Sciences', createdAt: new Date(), updatedAt: new Date() },
      { key: 'B.V.Sc & AH', value: 'Bachelor of Veterinary Sciences and Animal Husbandry', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('qualifications', null, {});
  }
};
