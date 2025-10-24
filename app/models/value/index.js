'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const db = {};




let sequelizevalue;


let loginDB = async (db) => {
  
}
// correcting sequalize date format to be congruent with JS date class
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);
  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

if (config.use_env_variable) {
  sequelizevalue = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizevalue = new Sequelize('Empresa', 'sa', 'dbsa', {
    host: 'canaslp.sytes.net',
    dialect: 'mssql',
    port: '1433'
  })
  /*
  sequelizeLO = new Sequelize(config.LO.database, config.LO.username, config.LO.password, config.LO);
  sequelizeSR = new Sequelize(config.SR.database, config.SR.username, config.SR.password, config.SR);
  sequelizeSJ = new Sequelize(config.SJ.database, config.SJ.username, config.SJ.password, config.SJ);
  */
}

async function syncModels() {
  await sequelizevalue.sync({ force: false })
  console.log('All models from value were synchronized suvalueessfully.');

  /*
  await sequelizeLO.sync({ force: false })
  console.log('All models from LO were synchronized suvalueessfully.');

  await sequelizeSR.sync({ force: false })
  console.log('All models from SR were synchronized suvalueessfully.');

  await sequelizeSJ.sync({ force: false })
  console.log('All models from SJ were synchronized suvalueessfully.');
  */
}




fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelizevalue, Sequelize.DataTypes);
    console.log(model)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});





sequelizevalue.authenticate().then(() => {
  console.log('Connection value has been established suvalueessfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});


db.sequelizevalue = sequelizevalue;

syncModels();




module.exports = db;
