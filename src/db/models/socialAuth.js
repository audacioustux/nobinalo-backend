export default (sequelize, DataTypes) => {
  const socialAuth = sequelize.define(
    'socialAuth',
    {
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
      },
      refreshToken: {
        type: DataTypes.STRING,
      },
      provider: {
        type: DataTypes.ENUM(
          'google', 'twitter', 'facebook', 'github', 'gitlab',
        ),
        allowNull: false,
      },
      response: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {},
  );

  socialAuth.associate = (models) => {
    socialAuth.belongsTo(models.User, {
      // as: 'socialCred',
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return socialAuth;
};
