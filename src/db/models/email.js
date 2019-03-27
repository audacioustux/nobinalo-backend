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
    {
      indexes: [
        { fields: ['email', 'isPrimary'], unique: true },
      ],
    },
  );

  Email.associate = (models) => {
    Email.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };
  // Email.sync({ force: true });
  return Email;
};
