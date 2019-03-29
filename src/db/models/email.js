export default (sequelize, DataTypes) => {
  const Email = sequelize.define(
    'Email',
    {
      email: {
        type: DataTypes.STRING,
        validators: {
          isEmail: true,
        },
        primaryKey: true,
        unique: true,
      },
    },
    {},
  );

  Email.associate = (models) => {
    Email.belongsToMany(models.User, { through: 'userEmail', foreignKey: 'emailPk' });
  };
  // Email.sync({ force: true });
  return Email;
};
