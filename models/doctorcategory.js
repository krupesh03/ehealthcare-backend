'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.DoctorCategory.hasOne(models.User, {
        foreignKey: 'doc_category',
        as: 'doctorCategoryDetails'
      });
    }
  }
  DoctorCategory.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DoctorCategory',
    paranoid: true
  });
  return DoctorCategory;
};