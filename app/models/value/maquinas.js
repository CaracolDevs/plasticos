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
    MaquinaId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.DECIMAL(3,0),
    },
    Maquina: {
        allowNull: false,
        type: DataTypes.STRING
    }

  }, {
    sequelize,
    timestamps: false,
    tableName: 'maquinas',
    modelName: 'maquinas', //must be 'rawTable' but DB was created time ago and required to be named like this
    freezeTableName: true //xportFacturasGlobales
  });
  return rawTable;
};