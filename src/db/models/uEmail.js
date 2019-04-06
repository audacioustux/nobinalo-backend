export default (sequelize, DataTypes) => {
  const uEmail = sequelize.define(
    'uEmail',
    {
      email: {
        type: DataTypes.STRING,
        validators: {
          isEmail: true,
        },
        unique: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.CHAR(6),
        allowNull: false,
      },
      attempts: {
        type: DataTypes.JSONB,
      },
    },
    {},
  );
  // uEmail.sync({ force: true });
  return uEmail;
};
