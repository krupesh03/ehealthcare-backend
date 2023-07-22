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
   await queryInterface.bulkInsert('doctorcategories', [
    { key: 'Nl', value: 'Neurologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Sg', value: 'Surgeon', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Ol', value: 'Oncologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Ot', value: 'Otolaryngologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Dl', value: 'Dermatologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Op', value: 'Ophthalmologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Cl', value: 'Cardiologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Gl', value: 'Gynecologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Pc', value: 'Pediatrician', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Vet', value: 'Veterinary', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Epi', value: 'Epidemiologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Gs', value: 'General Surgeons', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Al', value: 'Anesthesiologist', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Crs', value: 'Colon and Rectal Surgeon', createdAt: new Date(), updatedAt: new Date() },
    { key: 'Enc', value: 'Endocrinologist ', createdAt: new Date(), updatedAt: new Date() }
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('doctorcategories', null, {});
  }
};
