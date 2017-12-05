const mysql = require('mysql')

exports.getUserById = function getUserById(con, id) {
  return new Promise((resolve, reject) =>
    con.query(`SELECT * FROM users where id = ?`, [id], (err, results, fields) => {
      if (err) reject(err)

      else if (!results.length) {
        resolve(null)
      } else if (results.length === 1) {
        resolve(results[0])
      } else {
        reject(`Duplicate in data, found ${results.length} where name = ${name}`)
      }
    })
  )
}

exports.getUserBy_NamePassword = function getUserBy_IdName(con, name, password) {
  return new Promise((resolve, reject) =>
    con.query(
      `SELECT * FROM users where name=${con.escape(name)} and password=${con.escape(password)}`,
      (err, results, fields) => (err ? reject(err) : resolve(results))
    )
  )
}

function getUserByName(con, name) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM users where name=${con.escape(name)}`, (err, results, fields) => {
      if (err) reject(err)


      else if (!results.length) {
        resolve(null)
      } else if (results.length === 1) {
        resolve(results[0])
      }
      if (results.length > 1) {
        reject(`Duplicate in data, found ${results.length} where name = ${name}`)
      }
    })
  })
}
exports.getUserByName = getUserByName

exports.addUser = function addUser(con, name, password, role = 2) {
  return new Promise((resolve, reject) => {
    getUserByName(con, name).then(res => {
      if (res !== null) {
        reject(`User [${name}] already exists`)
      }

      con.query(
        `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`,
        [name, password, role],
        (err, results, fields) => {
          console.log(err)
          if (err)
            reject(err)
          else resolve(results)
        }
      )
    })
  })
}
