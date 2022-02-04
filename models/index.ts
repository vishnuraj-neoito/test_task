'use strict';
// @ts-nocheck
// @ts-ignore
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
console.log("environment",env);


const config = require(__dirname + `${env==='local'?'/../config/config.ts':'/../config/config.js'}`)[env];

console.log(config)
const db:any = {};
let sequelize:any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file:any) => {
    if(env==='local'){
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
    }else{
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }
    
  })
  .forEach((file:any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName:any) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;