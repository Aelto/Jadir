"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
function default_1(dbConfig) {
    let connection = null;
    try {
        connection = mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            dateStrings: 'date',
            multipleStatements: true
        });
        connection.connect();
    }
    catch (err) {
        console.log(`error when opening database connection: ${err.message}`);
        process.exit();
    }
    return connection;
}
exports.default = default_1;
