export default (sequelize, DataTypes) => {
  const Email = sequelize.define(
    'uEmail',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validators: {
          isEmail: true,
        },
        unique: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {},
  );
  return Email;
};
