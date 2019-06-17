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
        allowNull: false,
        validate: { validateHandle },
      },
      fullName: {
        type: DataTypes.STRING(80),
      },
      displayName: {
        type: DataTypes.STRING(32),
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
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

  User.associate = (models) => {
    User.belongsToMany(models.Email, { as: 'emails', through: 'userEmail' });
  };

  // User.sync({ force: true });
  return User;
};
