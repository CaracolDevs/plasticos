'use strict';
const {
  Model
} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class rawTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /*usuario.belongsTo(models.edad, {
        foreignKey: 'id_name'
      })*/

 
    }
    
  }
  // extracs info from the basic factures table in the DB
  rawTable.init({
    UserId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.DECIMAL(3,0),
    },
    User: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    Password: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    Departament: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    DepartamentId: {
        allowNull: false,
        type: DataTypes.DECIMAL(3,0),
    },
    Super: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'usuarios',
    modelName: 'usuarios', //must be 'rawTable' but DB was created time ago and required to be named like this
    freezeTableName: true //xportFacturasGlobales
  });
  return rawTable;
};