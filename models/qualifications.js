'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qualifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Qualifications.hasOne(models.User, {
        foreignKey: 'qualification',
        as: 'qualificationDetails'
      });
    }
  }
  Qualifications.init({
    key: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Qualifications',
    paranoid: true
  });
  return Qualifications;
};