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
    ColaborId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.DECIMAL(3,0),
    },
    Name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    Role: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    NoEmpleado: {
        allowNull: false,
        type: DataTypes.DECIMAL(15,0),
    },
    NoImss: {
        allowNull: false,
        type: DataTypes.DECIMAL(15,0),
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'colaboradores',
    modelName: 'colaboradores', //must be 'rawTable' but DB was created time ago and required to be named like this
    freezeTableName: true //xportFacturasGlobales
  });
  return rawTable;
};