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
      paranoid: true,
    },
  );
  return User;
};
