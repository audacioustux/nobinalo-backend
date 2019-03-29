export default (sequelize, DataTypes) => {
  const userEmail = sequelize.define(
    'userEmail',
    {
      forDigest: {
        type: DataTypes.BOOLEAN,
      },
      forRecovery: {
        type: DataTypes.BOOLEAN,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        validators: {
          is: /^(true|yes|t|y|on|1)$/i,
        },
        defaultValue: null,
      },
    },
    {
      indexes: [
        { fields: ['emailPk', 'isPrimary'], unique: true },
      ],
    },
  );

  return userEmail;
};
