const mysql = require('mysql')

exports.createPost = function createPost(con, title, description, tags, author, authorId) {
  return new Promise((resolve, reject) => {
    const date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    con.query(
      `INSERT INTO posts (title, author_id, author, content, tags, date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, authorId, author, description, tags, date],
      (err, results, fields) => {
        if (err) reject(err)
        else resolve(results.length ? results[0] : results)
      }
    )
  })
}

exports.getPost = function getPost(con, id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM posts WHERE id=?`, [id], (err, results, fields) => {
      if (err) reject(err)
      else if (!results.length) {
        resolve(null)
      } else if (results.length === 1) {
        resolve(results[0])
      }
      if (results.length > 1) {
        reject(`Duplicate in data, found ${results.length} where title = ${title}`)
      }
    })
  })
}

exports.getPosts = function getPost(con, firstId, lastId) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM posts WHERE id BETWEEN ? and ?`, [firstId, lastId], (err, results, fields) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}
