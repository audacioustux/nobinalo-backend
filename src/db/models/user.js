import argon from 'argon2';
import os from 'os';
import {
  validatePassword, validateHandle, MAX_HANDLE_LENGTH,
} from '../utils/validators';

const argonOptions = { parallelism: os.cpus().length - 1 };

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      handle: {
        type: DataTypes.STRING(MAX_HANDLE_LENGTH),
        allowNull: true,
        unique: true,
        validate: { validateHandle },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING(64),
      },
      gender: {
        type: DataTypes.CHAR(1),
        validate: {
          isIn: [['m', 'f', 'o']],
        },
      },
      lastLoggedAt: {
        type: DataTypes.DATE,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      getterMethods: {
        gender() {
          const GENDERS = {
            m: 'male',
            f: 'female',
            o: 'other',
          };
          return GENDERS[this.getDataValue('gender')];
        },
      },
      setterMethods: {
        gender(value) {
          return this.setDataValue('gender', value[0]);
        },
      },
      hooks: {
        beforeSave: (instance) => {
          if (instance.changed('password')) {
            validatePassword(instance.password);
            return argon.hash(instance.password, argonOptions)
              .then(hashedPw => instance.setDataValue('password', hashedPw));
          } return instance;
        },
      },
      paranoid: true,
    },
  );

  User.prototype.isValidPass = async function isValidPass(rawPassword) {
    return argon.verify(this.password, rawPassword);
  };
  return User;
};
