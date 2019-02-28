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
        primaryKey: true,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        validators: {
          is: /^(true|yes|t|y|on|1)$/i,
        },
        defaultValue: null,
      },
      forDigest: {
        type: DataTypes.BOOLEAN,
      },
      forRecovery: {
        type: DataTypes.BOOLEAN,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
      },
    },
    {},
  );

  Email.associate = (models) => {
    Email.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Email;
};
