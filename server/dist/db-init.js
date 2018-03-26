"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
function default_1(dbConfig) {
    const connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        dateStrings: 'date',
        multipleStatements: true
    });
    connection.connect();
    return connection;
}
exports.default = default_1;
