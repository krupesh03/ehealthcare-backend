'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientAdmissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientAdmissions.User = models.PatientAdmissions.belongsTo(models.User, {
        foreignKey: 'patient_id',
        as: 'patient_admissions'
      });
    }
  }
  PatientAdmissions.init({
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        id: 'id'
      }
    },
    admission_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PatientAdmissions',
    paranoid: true
  });
  return PatientAdmissions;
};