const mysql = require('mysql')

export default function(dbConfig: any) {
  const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    dateStrings: 'date',
    multipleStatements: true
  })

  connection.connect()

  return connection
}