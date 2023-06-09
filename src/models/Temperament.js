const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define(
    'temperament',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true, // el nombre del modelo es igual al nombre de la tabla en la db
      timestamps: false, // elimina los campos createdAt y updatedAt en la db
    }
  );
};
