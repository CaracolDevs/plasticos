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
      type: DataTypes.DECIMAL(6,0),
    },
    MaquinaId: {
      allowNull: false,
      type: DataTypes.DECIMAL(3,0),
    },
    Maquina: {
        allowNull: false,
        type: DataTypes.STRING
    },
    ColaborId: {
      allowNull: false,
      type: DataTypes.DECIMAL(3,0),
    },
    Colabor: {
        allowNull: false,
        type: DataTypes.STRING
    },
    Date: {
        allowNull: false,
        type: DataTypes.DATE
    },
    Turno: {
        allowNull: false,
        type: DataTypes.STRING
    },
    Insumo: {
        allowNull: false,
        type: DataTypes.STRING
    },
    LoteInsumo: {
        allowNull: false,
        type: DataTypes.STRING
    },
    InsumoInicial: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    InsumoFinal: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    Contenedor: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    },
    ContenedorInicial: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    ContenedorFinal: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    SolicitudInsumo: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    },
    SolicitudInsumoQty: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    SolicitudInsumoFolio: {
        allowNull: false,
        type: DataTypes.STRING
    },
    SolicitudInsumoFolioSalida: {
        allowNull: false,
        type: DataTypes.STRING
    },
    InventarioInicial: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    InventarioFinal: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    InsumoUtilizado: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    InsumoMermado: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    },
    InsumoValidado: {
        allowNull: false,
        type: DataTypes.DECIMAL(7,0),
    }


    
  }, {
    sequelize,
    timestamps: false,
    tableName: 'insumos',
    modelName: 'insumos', //must be 'rawTable' but DB was created time ago and required to be named like this
    freezeTableName: true //xportFacturasGlobales
  });
  return rawTable;
};