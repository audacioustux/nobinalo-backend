export default (sequelize, DataTypes) => {
  const uEmail = sequelize.define(
    'uEmail',
    {
      email: {
        type: DataTypes.STRING,
        validators: {
          isEmail: true,
        },
        primaryKey: true,
        unique: true,
      },
      key: {
        type: DataTypes.INTEGER,
      },
      attemps: {
        type: DataTypes.SMALLINT,
      },
    },
    {
      indexes: [
        { fields: ['email', 'UserId'], unique: true },
      ],
    },
  );

  uEmail.associate = (models) => {
    uEmail.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };
  // uEmail.sync({ force: true });
  return uEmail;
};
