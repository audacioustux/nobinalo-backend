import { validatePassword } from '../utils/validators';

const argon = require('argon2');

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      handle: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
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
            return argon.hash(instance.password)
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
