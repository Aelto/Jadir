const mysql = require('mysql')

export default function(dbConfig: any) {
  let connection = null

  try {
    connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      dateStrings: 'date',
      multipleStatements: true
    })

    connection.connect()
  } catch (err) {
    console.log(`error when opening database connection: ${err.message}`)
    process.exit()
  }

  return connection
}