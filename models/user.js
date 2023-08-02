'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(models.Qualifications, {
        foreignKey: 'qualification',
        as: 'qualificationDetails'
      });

      models.User.belongsTo(models.DoctorCategory, {
        foreignKey: 'doc_category',
        as: 'doctorCategoryDetails'
      });

      User.Patient = models.User.hasOne(models.PatientAdmissions, {
        foreignKey: 'patient_id',
        as: 'patient_admissions'
      });
    }
  }
  User.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      set(value) { 
        if( !value ) {
          this.setDataValue('birth_date', null);
        } else {
          this.setDataValue('birth_date', value);
        }
      }
    },
    age: {
      type: DataTypes.BIGINT,
      allowNull: true,
      set(value) {
        if( !value ) {
          this.setDataValue('age', null);
        } else {
          this.setDataValue('age', value);
        }
      }
    },
    gender: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    blood_group: {
      type: DataTypes.TEXT('tiny'),
      allowNull: true
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qualification: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    doc_category: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    access_token: {
      type: DataTypes.VIRTUAL
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};