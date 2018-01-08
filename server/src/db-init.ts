const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const mysql = require('mysql')

const databaseConfigPath = path.join(__dirname, '../db.config.json')

if (!fs.existsSync(databaseConfigPath)) {
  console.log(`${chalk.red('error')} could not find database config at ${databaseConfigPath}`)
  process.exit(1)
}

const dbConfig = JSON.parse(fs.readFileSync(databaseConfigPath))

export default function() {
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