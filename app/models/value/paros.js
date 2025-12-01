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
    Id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.DECIMAL(3,0),
    },
    Maquina: {
        allowNull: false,
        type: DataTypes.STRING
    },
    MaquinaID: {
        allowNull: false,
        type: DataTypes.DECIMAL(1,0)
    },
    Colabor: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    ColaborId: {
        allowNull: false,
        type: DataTypes.DECIMAL(3,0),
    },
    TipoParo: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    Paro: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    Date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    HoraInicio: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    HoraFinal: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    DifMinutos: {
      allowNull: false,
      type: DataTypes.DECIMAL(3,0)
    }

  }, {
    sequelize,
    timestamps: false,
    tableName: 'paros',
    modelName: 'paros', //must be 'rawTable' but DB was created time ago and required to be named like this
    freezeTableName: true //xportFacturasGlobales
  });
  return rawTable;
};