const mysql = require('mysql');
const consola = require('consola');
const getConfig = require('./config.js');

let connection = null;

exports.dbInit = function() {
  const { database } = getConfig();

  try {
    connection = mysql.createConnection({
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.database,
      dateStrings: 'date',
      multipleStatements: true
    });

    connection.connect();
  }
  catch (err) {
    consola.error('error when opening data connection');
    consola.error(err);
    process.exit(1);
  }

  return connection;
};

exports.getConnection = function() {
  if (connection === null) {
    throw new Error('cannot get connection, connection not ready');
  }

  return connection;
}