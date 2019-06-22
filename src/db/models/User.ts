import sequelize from '../sequelize';
import { Model, DataTypes } from 'sequelize';

const MAX_HANDLE_LENGTH = 40;

class User extends Model {}
User.init(
  {
    handle: {
      type: DataTypes.STRING(MAX_HANDLE_LENGTH),
      allowNull: true,
      unique: true,
      //   validate: { validateHandle },
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
    sequelize,
    modelName: 'user',
  },
);

export default User;
