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
        type: DataTypes.ENUM('male', 'female', 'other'),
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

  // User.sync({ force: true });
  return User;
};
