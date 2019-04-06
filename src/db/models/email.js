export default (sequelize, DataTypes) => {
  const Email = sequelize.define(
    'Email',
    {
      email: {
        type: DataTypes.STRING,
        validators: {
          isEmail: true,
        },
        unique: true,
        allowNull: false,
      },
    },
    {},
  );

  // Email.sync({ force: true });
  return Email;
};
